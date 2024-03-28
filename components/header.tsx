export default function Home() {
  return (
    <header className="text-center">
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
