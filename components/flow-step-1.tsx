import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import { Link, LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import IconGitHub from './icon-github'
import { Input } from './ui/input'
import { StoreState } from '../store'
import { useFormStatus } from 'react-dom'

export interface FlowStep1Props extends Pick<StoreState, 'user'> {
  dispatch: (payload: FormData) => void
}

export default function FlowStep1({ user, dispatch }: FlowStep1Props) {
  //TODO: make this a pop up
  //TODO: maybe get client id from env
  return (
    <StepItem>
      <StepNumber />
      <StepTitle>
      <a href="https://github.com/login/oauth/authorize?client_id=Iv1.203244c6dd3aa706" target="_blank"> Login with Github.</a>.
      </StepTitle>
      <StepContent>
        <form action={dispatch}>
          <Form user={user} />
        </form>
      </StepContent>
    </StepItem>
  )
}

function Form({ user }: { user: StoreState['user'] }) {
  const { pending } = useFormStatus()

  return user ? (
    <Content>
      <div className="flex items-center gap-2">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={32}
          height={32}
          className="rounded-full size-8"
        />
        <span className="font-medium">{user.login}</span>
      </div>

      <div className="flex flex-col sm:ml-auto">
        <input hidden name="username" />
        <Button size="sm" variant="outline" disabled={pending}>
          {pending && <LoaderCircle size={20} className="animate-spin mr-2" />}
          Change Account
        </Button>
      </div>
    </Content>
  ) : (
    <Content>
      <IconGitHub height={32} className="shrink-0 hidden sm:inline-flex" />
      <Input
        name="username"
        className="sm:grow"
        placeholder="username"
        disabled={pending}
      />
      <Button size="sm" disabled={pending}>
        {pending && <LoaderCircle size={20} className="animate-spin mr-2" />}
        Get Repositories
      </Button>
    </Content>
  )
}
