import type { DefaultSession, NextAuthConfig } from 'next-auth'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'

declare module 'next-auth' {
  interface Session {
    user: {
      username?: string | null
    } & DefaultSession['user']
  }
}

export const config = {
  providers: [GitHub],
  basePath: '/auth',
  callbacks: {
    authorized() {
      return true
    },
    jwt({ token, profile }) {
      if (profile) {
        token.username = profile.login
        token.name = profile.name
      }
      return token
    },
    session: ({ session, token }) => {
      if (session?.user) {
        // session.user.username = token.username
        session.user.username = token.username as string
      }
      return session
    }
  }
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
