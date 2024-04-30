import * as React from 'react'
import { useRef } from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import IconGitHub from './icon-github'
import store from 'store'
import { useSearchParams } from 'next/navigation'
import { Profile, Repository } from 'lib/types'

export interface FlowStep1Props {}

export default function FlowStep1({}: FlowStep1Props) {
  const initialized = useRef(false)
  const searchParams = useSearchParams()

  const { setLoadingUser, setUser, setRepos } = store()

  function checkCode() {
    let code = searchParams.get('code')

    if (code) {
      localStorage.setItem('code', code)
      window.location.href = '/'
      return
    }

    code = localStorage.getItem('code')

    if (code) {
      init(code)
    }
  }

  async function init(code: string) {
    try {
      setLoadingUser(true)

      const request = await fetch('/api/login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          code,
        },
      })

      if (!request.ok) throw new Error('Failed to login. Please try again.')

      const response: { user: Profile; repos?: Repository[] } =
        await request.json()

      setUser(response.user)
      setRepos(response.repos || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingUser(false)
    }
  }

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      checkCode()
    }
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
      <div className="flex grow items-center gap-2 sm:grow">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={32}
          height={32}
          className="size-8 rounded-full"
        />
        <span className="font-medium">{user.login}</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          localStorage.removeItem('code')
          window.location.href = '/'
        }}
      >
        Logout
      </Button>
    </Content>
  ) : (
    <Content>
      <IconGitHub height={32} className="hidden shrink-0 sm:inline-flex" />
      <Button size="sm" asChild>
        <a href="https://github.com/apps/gitfix-by-upstash/installations/new/">
          Login
        </a>
      </Button>
    </Content>
  )
}
