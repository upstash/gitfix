import { auth } from 'auth'
import { SignIn, SignOut } from './auth-components'

export default async function UserButton() {
  const session = await auth()

  if (!session?.user) return <SignIn />

  return (
    <div className="flex p-4 items-center rounded-xl justify-between bg-white/5">
      {session.user.name}
      <SignOut />
    </div>
  )
}
