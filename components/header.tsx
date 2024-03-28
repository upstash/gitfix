import IconGitFix from './gitfix-logo'

export default function Home() {
  return (
    <header className="text-center">
      <span className="fixed inset-x-0 top-0 h-[200px]
      bg-gradient-to-b from-emerald-300/20 to-emerald-300/0
      dark:from-emerald-300/10" />

      <IconGitFix className="inline-flex mb-2" />
      <h1 className="text-4xl sm:text-5xl font-bold">GitFix</h1>
      <h3 className="sm:mt-2 mx-6 sm:mx-0 sm:text-xl font-medium">
        Correct grammar errors in your md and mdx files!
      </h3>
      <p className="mt-1 sm:text-lg opacity-60 text-pretty md:mx-24">
        GitFix uses GitHub and OpenAI (GPT4) APIs to fetch your markdown files
        and correct grammatical errors.
      </p>
    </header>
  )
}
