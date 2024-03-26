export default function Home() {
  return (
    <header className="text-center">
      <h1 className="text-5xl font-bold">GitFix</h1>
      <h3 className="mt-2 text-xl font-medium">
        Correct grammar errors in your md and mdx files!
      </h3>
      <p className="mt-1 text-lg opacity-60 text-pretty md:mx-24">
        Gitfix uses github and OpenAI apis to fetch your md/mdx files and uses
        GPT4 to correct grammatical errors.
      </p>
    </header>
  )
}
