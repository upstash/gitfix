import './globals.css'

import React from 'react'
import type { Metadata } from 'next'
import { cn } from 'lib/utils'

export const metadata: Metadata = {
  metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
  title: 'Create Next App',
  description: 'Generated by create next app',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={cn(
          'antialiased bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-200'
        )}
      >
        {children}
      </body>
    </html>
  )
}
