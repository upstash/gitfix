export default async function (config: any) {
  const token = config['access_token']

  const userRequest = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
    },
  })
  if (!userRequest.ok) {
    throw Error('Broken github token')
  }
  const userData = await userRequest.json()
  const installationsRequest = await fetch(
    `https://api.github.com/user/installations`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        Accept: 'application/vnd.github+json',
      },
    },
  )
  if (!installationsRequest.ok) {
    throw Error('Broken github token')
  }
  if(process.env.GITFIX_APP_SLUG){

    const installationData = await installationsRequest.json()
    let installationId
    let RepoList = []
    for (let i = 0; i < installationData.total_count; i++) {
      let installation = installationData.installations[i]
      if (installation.app_slug == config['app-slug']){
        installationId = installation.id

        const repoRequest = await fetch(
          `https://api.github.com/user/installations/${installationId}/repositories?per_page=100`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-GitHub-Api-Version': '2022-11-28',
              Accept: 'application/vnd.github+json',
            },
          },
        )
        const repoData = await repoRequest.json()
        if (!repoRequest.ok) {
          throw Error('Broken github token')
        }
        for (let k = 0; k < repoData.total_count; k++) {
          console.log(repoData.repositories[k].full_name)
          RepoList.push(repoData.repositories[k])
        }
      }
    }
    
    return { user: userData, repos: RepoList }
  }else{
    const repoRequest = await fetch(
      `https://api.github.com/user/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github+json',
        },
      },
    )
    const repoData = await repoRequest.json()
    if (!repoRequest.ok) {
      throw Error('Broken github token')
    }
    for (let i = 0; i < repoData.length; i++) {
      console.log(repoData[i].repositories.full_name)
    }
    
    return { user: userData, repos: repoData.repositories }
  }
  }
  