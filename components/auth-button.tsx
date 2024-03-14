import React from 'react'
import { signIn, signOut } from 'auth'
import { Button, ButtonProps } from './ui/button'

export function SignIn({
  provider,
  ...props
}: { provider?: string } & ButtonProps) {
  return (
    <form
      action={async () => {
        'use server'
        await signIn(provider)
      }}
    >
      <Button {...props} />
    </form>
  )
}

export function SignOut(props: ButtonProps) {
  return (
    <form
      action={async () => {
        'use server'
        await signOut()
      }}
    >
      <Button {...props} />
    </form>
  )
}
