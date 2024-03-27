export default function Footer() {
  return (
    <footer
      className="border-t text-center border-t-zinc-100
        dark:border-t-zinc-900 pt-10 mt-20 space-y-4"
    >
      <p>
        Built using{' '}
        <a
          href="https://openai.com"
          target="_blank"
          className="underline decoration-zinc-300"
        >
          OpenAI
        </a>
        ,{' '}
        <a
          href="http://upstash.com"
          target="_blank"
          className="underline decoration-zinc-300"
        >
          Upstash Redis
        </a>{' '}
        and{' '}
        <a
          href="http://vercel.com/"
          target="_blank"
          className="underline decoration-zinc-300"
        >
          Vercel
        </a>
        .
      </p>

      <p>
        <a
          href="https://github.com/upstash/gitfix"
          target="_blank"
          className="underline decoration-zinc-300"
        >
          Source Code on GitHub
        </a>
      </p>

      <p>
        <a className="inline-flex hover:bg-transparent" href="/">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </p>
    </footer>
  )
}
