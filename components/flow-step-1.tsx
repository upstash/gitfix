import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import IconGitHub from './icon-github'
import store from 'store'
import { useSearchParams } from 'next/navigation'
import { Profile, Repository } from 'lib/types'
import ALink from './link'

export interface FlowStep1Props {}

export default function FlowStep1({}: FlowStep1Props) {
  const { setLoadingUser, setUser, setRepos } = store()

  const searchParams = useSearchParams()

  function checkCode() {
    let code = searchParams.get('code')

    if (!code) return false

    localStorage.setItem('code', code)
    window.location.href = '/'
    return true
  }

  async function init() {
    if (checkCode()) return

    let code = localStorage.getItem('code')

    if (!code) {
      return
    }

    try {
      setLoadingUser(true)

      const request = await fetch('/api/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          code: code.toString(),
        },
      })

      const response: { user: Profile; repos: Repository[] } =
        await request.json()

      setUser(response.user)
      setRepos(response.repos)
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingUser(false)
    }
  }

  React.useEffect(() => {
    init()
  }, [])

  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Choose a GitHub Account</StepTitle>
      <StepContent>
        <Form />
      </StepContent>
    </StepItem>
  )
}

function Form({}: {}) {
  const { user, loadingUser } = store()

  return loadingUser ? (
    <Content>
      <div className="flex items-center gap-2">
        <LoaderCircle size={20} className="animate-spin" />
        <span>Loading</span>
      </div>
    </Content>
  ) : user ? (
    <Content>
      <div className="flex items-center gap-2">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
        <span className="font-medium">{user.login}</span>
      </div>

      <div className="flex items-center gap-2 sm:ml-auto">
        <ALink
          className="order-2 sm:-order-10"
          href="https://github.com/apps/upstash-gitfix/installations/new/"
        >
          Manage
        </ALink>
        <Button
          size="sm"
          className="grow"
          variant="outline"
          onClick={() => {
            localStorage.removeItem('code')
            window.location.href = '/'
          }}
        >
          Logout
        </Button>
      </div>
    </Content>
  ) : (
    <Content>
      <IconGitHub height={32} className="hidden shrink-0 sm:inline-flex" />
      <Button size="sm" asChild>
        <a href="https://github.com/apps/upstash-gitfix/installations/new/">
          Login
        </a>
      </Button>
    </Content>
  )
}
