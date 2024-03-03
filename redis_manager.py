

import random
import string
import json
def generate_random_string(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))


class Redis_Wrapper:
    def __init__(self, url, token, from_fly=False):

        if not from_fly:
            print("connecting to redis via upstash-redis")
            from upstash_redis import Redis
            self.redis = Redis(url=url, token=token)
        else:
            import redis
            print("Connecting to fly hosted redis")
            self.redis= redis.Redis(
                host=url,
                port=6379,
                password=token
                )

    def insert(self, set_name, items):

        self.redis.sadd(set_name, items)
    
    def bulk_insert(self, set_name, items):
        for i in items:
            self.insert(set_name,i)

    def get_difference(self, set_name, items):

        random_set = generate_random_string(20)
        self.bulk_insert(random_set, items)

        difference = self.redis.sdiff(random_set, set_name)
        
        self.redis.delete(random_set)
        result = []
        for i in difference:
            result.append(json.loads(i))
        return result
    def get_members(self, set_name):
        members = self.redis.smembers(set_name)
        result = []
        for i in members:
            result.append(json.loads(i))
        return result

