
import yaml
import os
import sys
from colorama import Fore
from openai import OpenAI
import random


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

if __name__ == "__main__":

    config = read_config_file()

    path = config["github-repo"]
    path_tokens = path.split("/")
    owner, repo = path_tokens[-2], path_tokens[-1]
    original_repo = Github_API_Wrapper(owner, repo, config["github-token"])
    original_repo.get_items()
    forked_repo = original_repo.fork()

    
  
    forked_repo.create_a_ref_from_default_branch("gitfix")
    redis = Redis(config["upstash-redis-url"], config["upstash-redis-token"])
    unupdated_items = redis.get_difference(path,original_repo.items)

    openai_client = OpenAI(api_key=config["openai-key"])
    for n in range(config["files-per-run"]):
        k = random.randint(0, len(original_repo.items)-1)
        file_content = original_repo.get_item_content(k)
        corrected_content = generate_gramatically_correct_content(openai_client, file_content)
        forked_repo.update_file_content(k, corrected_content)
        redis.insert(path, forked_repo.items[k])
    forked_repo.create_PR(forked_repo)
    
     
    