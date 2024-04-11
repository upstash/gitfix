


export function register() {
  let obj: any = {
    "files-per-run": process.env.FILES_PER_RUN,
    "access_token": process.env.GITHUB_TOKEN,
    "upstash-redis-url": process.env.UPSTASH_REDIS_URL,
    "upstash-redis-token": process.env.UPSTASH_REDIS_TOKEN,
    "openai-key": process.env.OPENAI_KEY,
    "kv-url" : process.env.KV_REST_API_URL,
    "kv-token" : process.env.KV_REST_API_TOKEN,
    "client-id": process.env.GITHUB_APP_CLIENT_ID, 
    "github-auth": process.env.AUTH_WITH_GITHUB_APP
}
console.log(obj)
  }