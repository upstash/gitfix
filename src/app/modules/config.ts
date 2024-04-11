import config from '../../../config.json'
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
    }
    return <JSON>obj
}

async function codeExchangeWithGithub() {
    let code = await getSessionId() as string
    const params = {
        "code": code,
        "client_id": "Iv1.203244c6dd3aa706",
        "client_secret": "e5babb69693b253dbcda9a953a9b40f01f29aa7e"
    };
    const query = new URLSearchParams(params).toString();
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
    const params = {
        "refresh_token": await get('refresh_token') as string,
        "client_id": "Iv1.203244c6dd3aa706",
        "client_secret": "e5babb69693b253dbcda9a953a9b40f01f29aa7e",
        "grant_type": "refresh_token"
    };
    const query = new URLSearchParams(params).toString();
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

    let gitfixConfig = config
    if (process.env.GITFIX_USE_ENV) {
        gitfixConfig = generate_config_from_environment()
    }

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