
import yaml
import os
import sys
from colorama import Fore
from openai import OpenAI
import random
import time


from github_api import Github_API_Wrapper
from redis import Redis_Wrapper as Redis
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
    printer.print("Forking the repository.")
    try:
        forked_repo = original_repo.fork()
        time.sleep(1)
    except :
        printer.print("Forking process failed, aborting!")
        return
  
    forked_repo.create_a_ref_from_default_branch("gitfix")
    printer.print("Establishing redis connection.")
    try:
        redis = Redis(config["upstash-redis-url"], config["upstash-redis-token"])
        unupdated_items = redis.get_difference(path,original_repo.items)
        original_repo.items = unupdated_items
        forked_repo.items = unupdated_items
    except:
        printer.print("Cannot connect to redis, aborting!")
        return
    openai_client = OpenAI(api_key=config["openai-key"])
    indexes = [random.randint(0, len(original_repo.items)-1) for i in range(config['files-per-run'])]
    printer.print("Selecting files to update.")
    printer.print("Selected files:")
    for k in indexes:
        printer.print(f"\t {original_repo.items[k][0]}")
    for k in indexes:
        printer.print(f"Updating {original_repo.items[k][0]}")
        file_content = original_repo.get_item_content(k)
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
     
    