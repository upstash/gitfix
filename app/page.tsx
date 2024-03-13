import { auth } from 'auth'
import Header from 'components/header'
import { getRepositories } from './actions'
import { Repository } from 'lib/types'
import List from '../components/list'

export default async function Home() {
  const session = await auth()
  const repos: Repository[] = await getRepositories(
    session?.user.username || ''
  )

  return (
    <main className="text-center max-w-screen-md mx-auto px-6">
      <header>
        <h1>GitFix</h1>

        <h3>Correct grammar errors in your md and mdx files!</h3>

        <p>
          Gitfix uses github and OpenAI apis to fetch your md/mdx files and uses
          GPT4 to correct grammatical errors.
        </p>

        <p>
          Begin by inserting your public Github repo&apos;s link to the text
          area.
        </p>

        <div className="mt-10">
          <Header />
        </div>

        {session && (
          <div className="mt-10">
            <List data={repos} />
          </div>
        )}
      </header>
    </main>
  )
}
