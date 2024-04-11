import { get, set, getSessionId } from './session_store'

function getCurrentTime() {
    return new Date().getTime() / 1000
}
function generate_config_from_environment(): any {
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
    return <JSON>obj
}

export async function codeExchangeWithGithub() {
    let code = await getSessionId() as string
    console.log(`generating access token for ${code}`)
    const params = {
        "code": code,
        "client_id": process.env.GITHUB_APP_CLIENT_ID as string,
        "client_secret": process.env.GITHUB_APP_CLIENT_TOKEN as string
    };
    console.log(params)
    const query = new URLSearchParams(params).toString();
    console.log(query)
    const res = await fetch('https://github.com/login/oauth/access_token/?' + query, {
        method: 'POST',
        headers: {
            'accept': 'application/json'
        }
    })
    if (res.status != 200) {
        throw new Error("Failed to authenticate with github API")
    }
    let authResponse = await res.json()
    if (authResponse.error) {
        throw new Error("Failed to authenticate with github API")
    }
    console.log(authResponse)
    console.log(res.status)
    Object.keys(authResponse).forEach(function (key) {
        set(key, authResponse[key])
    })
    set('token_created', (Math.floor(getCurrentTime()).toString()))
}

async function refreshToken() {
    console.log(`refreshing token for ${await getSessionId()}`)
    const params = {
        "refresh_token": await get('refresh_token') as string,
        "client_id": process.env.GITHUB_APP_CLIENT_ID as string,
        "client_secret": process.env.GITHUB_APP_CLIENT_TOKEN as string,
        "grant_type": "refresh_token"
    };
    const query = new URLSearchParams(params).toString();
    console.log(query)
    const res = await fetch('https://github.com/login/oauth/access_token/?' + query, {
        method: 'POST',
        headers: {
            'accept': 'application/json'
        }
    })
    if (res.status != 200) {
        throw new Error("Failed to authenticate with github API")
    }
    let authResponse = await res.json()
    console.log(authResponse)
    console.log(res.status)
    Object.keys(authResponse).forEach(function (key) {
        set(key, authResponse[key])
    })
    set('token_created', (Math.floor(getCurrentTime()).toString()))
}
export default async function getConfig() {

    let gitfixConfig = generate_config_from_environment();

    if ((process.env.AUTH_WITH_GITHUB_APP)) {
        if (!(await getSessionId())) {
            throw Error("Broken session, please login again")
        }
        if (await get('access_token')) {
            let expiresIn = parseInt(await get('expires_in') as string)
            let refreshTokenExpiresIn = parseInt(await get('refresh_token_expires_in') as string)
            let created = parseInt(await get('token_created') as string)
            if (getCurrentTime() > refreshTokenExpiresIn + created) {
                throw Error("Refresh token expired")
            }
            if (getCurrentTime() > expiresIn + created) {
                console.log(`refreshing token for ${await getSessionId()}`)
                await refreshToken()
            }
        } else {
            await codeExchangeWithGithub()
        }
        //get the token as the last step
        gitfixConfig['access_token'] = await get('access_token') as string
    }

    return gitfixConfig
}