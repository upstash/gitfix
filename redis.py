from upstash_redis import Redis

import random
import string
import json
def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


class Redis_Wrapper:
    def __init__(self, url, token):

        self.redis = Redis(url=url, token=token)

    def insert(self, set_name, items):

        self.redis.sadd(set_name, items)

    def get_difference(self, set_name, items):

        random_set = generate_random_string(20)
        self.insert(random_set, items)

        difference = self.redis.sdiff(random_set, set_name)
        
        self.redis.delete(random_set)
        return json.loads(difference[0])

