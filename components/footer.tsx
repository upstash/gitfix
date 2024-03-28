import ALink from './link'

export default function Footer() {
  return (
    <footer
      className="text-center pt-16 mt-32 space-y-4
      text-zinc-700 dark:text-zinc-400"
    >
      <p>
        Built using{' '}
        <ALink href="https://openai.com" target="_blank">
          OpenAI
        </ALink>
        ,{' '}
        <ALink href="http://upstash.com" target="_blank">
          Upstash Redis
        </ALink>{' '}
        and{' '}
        <ALink href="http://vercel.com/" target="_blank">
          Vercel
        </ALink>
        .
      </p>

      <p>
        <ALink href="https://github.com/upstash/gitfix" target="_blank">
          Source Code on GitHub
        </ALink>
      </p>

      <p>
        <a className="inline-flex hover:bg-transparent" href="/">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </p>
    </footer>
  )
}
