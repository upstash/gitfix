import requests
import json
import base64 
class Github_API_Wrapper():
    def __init__(self, owner, repo, auth):
        self.owner = owner
        self.repo = repo
        self.auth = auth
        self.items = []
        self.populate_details()
    def get_items(self):
        initial_page_size = 100
        page_size = initial_page_size
        page= 1
        while page_size ==100:
            url = f"https://api.github.com/search/code?q=extension:mdx+extension:md+repo:{self.owner}/{self.repo}&per_page={initial_page_size}&page={page}"
            headers = {"Accept": "application/vnd.github+json",
                    "Authorization": f"Bearer {self.auth}"}
            response = requests.get(url, headers=headers)
            page_size = len(response.json()["items"])
            for item in (response.json()["items"]):
                print(f"{item['path']}")
                self.items.append((item['path'], item['sha']))
            page += 1
        response.close()
    def get_item_content(self, index):
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/contents/{self.items[index][0]}"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}"}
        response = requests.get(url, headers=headers)
        content = response.text
        response.close()
        return content
    def fork(self):
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/forks"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        body = {
            "name": f"GitFix-{self.owner}-{self.repo}",
            "default_branch_only": "True"
        }
        response = requests.post(url, headers=headers,json=body)
        content = response.text
        content = json.loads(content)
        full_name = content["full_name"]
        [owner, repo] = full_name.split('/')
        forked_repo = Github_API_Wrapper(owner,repo,self.auth)
        forked_repo.items = self.items
        return forked_repo
    def update_file_content(self, index, content):
        path = self.items[index][0]
        sha = self.items[index][1]
        print(f"Updating {path}")
        content = content.encode() 
        base64_bytes = base64.b64encode(content) 
        base64_string = base64_bytes.decode("ascii") 
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/contents/{path}"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        body = {
            "message": f"GitFix: correcting grammar errors",
            "content": base64_string,
            "sha" : sha,
            "branch": "gitfix"
        }
        response = requests.put(url, headers=headers,json=body)
        return response
    def create_a_reference(self,original_ref, new_ref_name):
        original_ref = self.get_ref(original_ref)
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/git/refs"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        body = {
            "ref": f"refs/heads/{new_ref_name}",
            "sha": original_ref["object"]["sha"]
        }
        response = requests.post(url, headers=headers,json=body)
        return response
    def create_a_ref_from_default_branch(self, new_ref_name):
        original_ref = self.get_default_branch()
        return self.create_a_reference(original_ref, new_ref_name)
    def get_ref(self, ref):
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/git/ref/heads/{ref}"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        content = requests.get(url, headers=headers)
        body = json.loads(content.text)
        return body
    def populate_details(self):
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        content = requests.get(url, headers=headers)
        body = json.loads(content.text)
        self.details = body
    def get_default_branch(self):
        return self.details["default_branch"]
    def create_PR(self, altered_repo):
        url = f"https://api.github.com/repos/{self.owner}/{self.repo}/pulls"
        headers = {"Accept": "application/vnd.github.raw+json",
                "Authorization": f"Bearer {self.auth}",
                "X-GitHub-Api-Version":"2022-11-28"
                }
        body = {
            "title": "Gitfix: fixing grammar errors in md and mdx files.",
            "head": "gitfix",
            "head_repo": f"{altered_repo.owner}/{altered_repo.repo}",
            "base": self.get_default_branch(),
            "maintainer_can_modify": True,
        }
        response = requests.post(url, headers=headers,json=body)
        return response