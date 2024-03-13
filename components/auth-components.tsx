import React from 'react'
import { signIn, signOut } from 'auth'
import { Button } from './ui/button'

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<'button'>) {
  return (
    <form
      action={async () => {
        'use server'
        console.log('signing in')
        await signIn(provider)
      }}
    >
      <Button {...props}>Sign In</Button>
    </form>
  )
}

export function SignOut(props: React.ComponentPropsWithRef<'button'>) {
  return (
    <form
      action={async () => {
        'use server'
        console.log('signing out')
        await signOut()
      }}
      className=""
    >
      <Button {...props}>Sign Out</Button>
    </form>
  )
}
