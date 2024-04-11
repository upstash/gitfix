import { get, set } from './session_store'

export default async function(){
    const token = await get("access_token")

    const userRequest = await fetch('https://api.github.com/user', {
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json"
        }
    }
    )
    const userData = await userRequest.json()
    const repoRequest = await fetch('https://api.github.com/user/repos', {
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Accept": "application/vnd.github+json"
        }
    }
    )
    const repoData = await repoRequest.json()

    for(let i = 0; i < repoData.length; i ++){
        console.log(repoData[i].full_name)
    }

    return {user: userData, repos: repoData}
}