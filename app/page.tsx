import { auth } from 'auth'
import { getRepositories } from './actions'
import { Repository } from 'lib/types'
import React from 'react'
import Flow from 'components/flow'
import { SessionProvider } from 'next-auth/react'

export default async function Home() {
  const session = await auth()

  const repos: Repository[] = await getRepositories(
    session?.user.username as string
  )

  return (
    <SessionProvider basePath={'/auth'} session={session}>
      <main className="max-w-screen-md mx-auto px-6 pt-10 pb-40">
        <header className="text-center">
          <h1 className="text-5xl font-bold">GitFix</h1>
          <h3 className="mt-2 text-xl font-medium">
            Correct grammar errors in your md and mdx files!
          </h3>
          <p className="mt-1 text-lg opacity-60 text-pretty md:mx-24">
            Gitfix uses github and OpenAI apis to fetch your md/mdx files and
            uses GPT4 to correct grammatical errors.
          </p>
        </header>

        <div className="mt-16">
          <Flow data={repos} />
        </div>

        <footer
          className="border-t text-center border-t-zinc-100
        dark:border-t-zinc-900 pt-10 mt-20"
        >
          <p>
            Built using{' '}
            <a href="https://openai.com" target="_blank" className="underline">
              OpenAI
            </a>
            ,{' '}
            <a href="http://upstash.com" target="_blank" className="underline">
              Upstash Redis
            </a>{' '}
            and{' '}
            <a href="http://vercel.com/" target="_blank" className="underline">
              Vercel
            </a>
            .
          </p>

          <p className="mt-6">
            <a className="inline-flex hover:bg-transparent" href="/">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </p>

          <p className="mt-6">
            <a
              href="https://github.com/upstash/gitfix"
              target="_blank"
              className="inline-flex hover:bg-transparent text-inherit hover:text-emerald-500"
            >
              <svg
                height="24"
                width="24"
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                fill="currentColor"
              >
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </a>
          </p>
        </footer>
      </main>
    </SessionProvider>
  )
}
