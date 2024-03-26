'use server'

import { Repository } from 'lib/types'
import { z } from 'zod'
import { ResultCode } from '../lib/utils'

interface Result {
  type: ResultCode
  repos: Repository[]
  username?: string
}

export async function getRepositories(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result> {
  try {
    const username = formData.get('username')

    const parsedCredentials = z
      .object({
        username: z.string().min(1).trim()
      })
      .safeParse({
        username
      })

    if (!parsedCredentials.success) {
      return { type: ResultCode.InvalidUsername, repos: [] }
    }

    const token = process.env.GITHUB_ACCESS_TOKENS
    if (!token) {
      return { type: ResultCode.EnvironmentError, repos: [] }
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKENS}`
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch')
    }

    const data: Repository[] = await response.json()

    if (data.length === 0) {
      return { type: ResultCode.EmptyRepos, repos: [] }
    }

    return {
      type: ResultCode.Success,
      repos: data,
      username: username as string
    }
  } catch (error) {
    return { type: ResultCode.Error, repos: [] }
  }
}
