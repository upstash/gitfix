import React from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import Flow from 'components/flow'
import { Toaster } from 'components/ui/toaster'

export default async function Home() {
  return (
    <main className="mx-auto max-w-screen-md px-8 pb-32 pt-10 sm:pt-16">
      <Header />
      <Flow />
      <Footer />

      <Toaster />
    </main>
  )
}
