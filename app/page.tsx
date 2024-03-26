import React from 'react'
import Header from 'components/header'
import Footer from 'components/footer'
import Flow from 'components/flow'
import { Toaster } from 'components/ui/toaster'

export default async function Home() {
  return (
    <main className="max-w-screen-md mx-auto px-6 pt-10 pb-40">
      <Header />
      <Flow />
      <Footer />

      <Toaster />
    </main>
  )
}
