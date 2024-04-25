import IconGitFix from './gitfix-logo'

export default function Home() {
  return (
    <header className="text-center">
      <span
        className="fixed inset-x-0 top-0 h-[200px]
      bg-gradient-to-b from-emerald-300/20 to-emerald-300/0
      dark:from-emerald-300/10"
      />

      <IconGitFix className="mb-2 inline-flex" />
      <h1 className="text-4xl font-bold sm:text-5xl">GitFix</h1>
      <h3 className="mx-6 font-medium sm:mx-0 sm:mt-2 sm:text-xl">
        Correct grammar errors in your md and mdx files!
      </h3>
      <p className="mt-1 text-pretty opacity-60 sm:text-lg md:mx-24">
        GitFix uses GitHub and OpenAI (GPT4) APIs to fetch your markdown files
        and correct grammatical errors.
      </p>
    </header>
  )
}
