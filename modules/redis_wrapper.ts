import { Redis } from '@upstash/redis'

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

class RedisWrapper {
  private redis: Redis

  constructor(url: string, token: string, fromFly: boolean = false) {
    console.log('Connecting to Redis via upstash-redis')
    this.redis = new Redis({ url, token })
  }

  async insert(setName: string, item: object): Promise<void> {
    await this.redis.sadd(setName, item)
  }

  async bulkInsert(setName: string, items: object[]): Promise<void> {
    for (const item of items) {
      await this.insert(setName, item)
    }
  }

  async getDifference(setName: string, items: object[]): Promise<any[]> {
    const randomSet = generateRandomString(20)
    await this.bulkInsert(randomSet, items)

    const difference = await this.redis.sdiff(randomSet, setName)

    await this.redis.del(randomSet)
    return difference
  }

  async getMembers(setName: string): Promise<any[]> {
    const members = await this.redis.smembers(setName)
    return members
  }

  async setKey(key: string, value: string) {
    await this.redis.set(key, value)
  }

  async getKey(key: string) {
    type PR = {
      link: string
      number: number
    }
    return await this.redis.get(key)
  }
}

export default RedisWrapper
