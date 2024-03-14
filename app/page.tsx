import { auth } from 'auth'
import { getRepositories } from './actions'
import { Repository } from 'lib/types'
import React from 'react'
import Flow from 'components/flow'
import { SessionProvider } from 'next-auth/react'

export default async function Home() {
  const session = await auth()
  const repos: Repository[] = await getRepositories(
    session?.user.username || ''
  )

  return (
    <SessionProvider basePath={'/auth'} session={session}>
      <main className="max-w-screen-md mx-auto px-6 pt-10 pb-40">
        <header>
          <h1>GitFix</h1>

          <h3>Correct grammar errors in your md and mdx files!</h3>

          <p>
            Gitfix uses github and OpenAI apis to fetch your md/mdx files and
            uses GPT4 to correct grammatical errors.
          </p>

          <p>
            Begin by inserting your public Github repo&apos;s link to the text
            area.
          </p>
        </header>

        <div className="mt-10">
          <Flow data={repos} />
        </div>
      </main>
    </SessionProvider>
  )
}
