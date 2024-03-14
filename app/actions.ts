'use server'

import { Repository } from 'lib/types'

export async function getRepositories(username: string): Promise<Repository[]> {
  if (!username) {
    return []
  }

  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKENS}`
      }
    })
    const data = await res.json()
    return data
  } catch (error) {
    return []
  }
}
