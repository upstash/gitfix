
import yaml
import os
import sys
from colorama import Fore
from openai import OpenAI
import random
import time
import random

from github_api import Github_API_Wrapper
from redis_manager import Redis_Wrapper
from grammar_correction import generate_gramatically_correct_content
def read_config_file():
    config = None
    if not os.path.isfile("config.yaml"):
        print(Fore.RED + 'Error: Config file does not exist!')
        exit(1)
    with open("config.yaml", "r") as cf:
        try:
            config = yaml.safe_load(cf)
        except yaml.YAMLError as exc:
            print(Fore.RED + 'Error in reading config file!')
            print(exc)
            exit(1)
    return config
def gitfix(owner, repo, printer, demo_mode = False):
    printer.print(f"Processing the repository {owner}/{repo}")
    config = read_config_file()
    original_repo = Github_API_Wrapper(owner, repo, config["github-token"])
    original_repo.get_items(printer=printer, demo_mode=demo_mode)
    if not (len(original_repo.items) > 0):
        printer.print("""Gitfix could not discover any files in the repositoy.\n
                      Make sure you inputed your repository name correctly and your repository is indexed in Github search engine.\n
                      If your repository is not indexed, please wait a while until Github indexes your repository.
                      """)   
        return 
    printer.print("Forking the repository.")
    try:
        forked_repo = original_repo.fork()
        time.sleep(1)
    except :
        printer.print("Forking process failed, aborting!")
        return
  
    printer.print("Establishing redis connection.")
    try:
        redis = Redis_Wrapper(config["upstash-redis-url"], config["upstash-redis-token"], from_fly=config['redis-from-fly'])
        path = f"{owner}/{repo}"
        unupdated_items = redis.get_difference(path,original_repo.items)
        print(unupdated_items)
        original_repo.items = unupdated_items
        forked_repo.items = unupdated_items
    except Exception as e:
        printer.print("Cannot connect to redis, aborting!")
        print(e)
        return
    openai_client = OpenAI(api_key=config["openai-key"])
    indexes = [0] + random.sample(range(1,len(original_repo.items)), min(len(original_repo.items),config['files-per-run'])-1)
    printer.print("Selecting files to update.")
    printer.print("Selected files:")
    for k in indexes:
        printer.print(f"\t {original_repo.items[k][0]}")
    try:
        forked_repo.create_a_ref_from_default_branch("gitfix")
    except:
        if demo_mode:
            printer.print("""Gitfix could not create a new branch for changes.\n
                      Please try again in a minute.
                      """)   
        else:
            printer.print("""Gitfix could not create a new branch for changes.\n
                      Make sure your github token has write rights.
                      """)   
        return 
    for k in indexes:
        printer.print(f"Updating {original_repo.items[k][0]}")
        file_content = original_repo.get_item_content(k)
        if len(file_content) < 50:
            continue
        corrected_content = generate_gramatically_correct_content(openai_client, file_content)
        forked_repo.update_file_content(k, corrected_content)
        redis.insert(path, forked_repo.items[k])
    printer.print("Creating PR request")
    original_repo.create_PR(forked_repo)
if __name__ == "__main__":

    config = read_config_file()

    path = config["github-repo"]
    path_tokens = path.split("/")
    owner, repo = path_tokens[-2], path_tokens[-1]
    class Local_Printer:
        def print(self ,str):
            print(str)
    printer = Local_Printer()
    gitfix(owner, repo, printer=printer)
     
    