'use client'

import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import Content from './content'
import { LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import { Button } from './ui/button'
import IconGitHub from './icon-github'
import { Input } from './ui/input'
import store from 'store/index'
import { useFormStatus } from 'react-dom'

export default function FlowStep1({
  dispatch
}: {
  dispatch: (payload: FormData) => void
}) {
  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Select a Github Account</StepTitle>
      <StepContent>
        <Content>
          <form action={dispatch} className="flex w-full items-center gap-2">
            <Form />
          </form>
        </Content>
      </StepContent>
    </StepItem>
  )
}

function Form() {
  const { pending } = useFormStatus()
  const { user } = store()

  return user ? (
    <>
      <Image
        src={user.avatar_url}
        alt={user.login}
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="font-medium">{user.login}</span>

      <div className="ml-auto flex">
        <input hidden name="username" />
        <Button size="sm" variant="outline" disabled={pending}>
          {pending && <LoaderCircle size={20} className="animate-spin mr-2" />}
          Change Github Account
        </Button>
      </div>
    </>
  ) : (
    <>
      <IconGitHub height={32} />
      <div className="flex items-center grow gap-2">
        <Input
          name="username"
          className="grow"
          placeholder="username"
          disabled={pending}
        />
        <Button size="sm" disabled={pending}>
          {pending && <LoaderCircle size={20} className="animate-spin mr-2" />}
          Get Repositories
        </Button>
      </div>
    </>
  )
}
