import type { DefaultSession, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      username: string
    } & DefaultSession['user']
  }
}

export const config = {
  providers: [GitHub],
  basePath: '/auth',
  callbacks: {
    authorized({ request, auth }) {
      return true
    },
    jwt({ token, profile,account }) {
      console.log(account)
      // console.log(profile) // github user profile
      if (profile) {
        token.username = profile.login
        token.name = profile.name
      }
      return token
    },
    session: ({ session, token }) => {
      if (session?.user && token?.username) {
        // @ts-ignore
        session.user.username = token?.username
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
