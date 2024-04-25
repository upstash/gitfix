'use client'

import * as React from 'react'
import { useToast } from './ui/use-toast'
import store from 'store/index'
import { Step } from './step-list'
import FlowStep1 from './flow-step-1'
import FlowStep2 from './flow-step-2'
import FlowStep3 from './flow-step-3'
import Confetti from './confetti'

export default function Flow() {
  const { toast } = useToast()

  const { streamText, isFinish, setFinish } = store()

  // React.useEffect(() => {
  //   // possible success messages:
  //   // - Success: Creating PR request.
  //   // - All grammar errors in the repository are previously corrected by GitFix.
  //   if (
  //     streamText.includes('Success:') ||
  //     streamText.includes('previously corrected')
  //   ) {
  //     setFinish(true)
  //   }
  // }, [streamText])

  return (
    <>
      <Step className="mt-16 md:mt-20">
        {/* Github profile */}
        <FlowStep1 />
        {/* Select a repository */}
        <FlowStep2 />
        {/* Creating PR Request */}
        <FlowStep3 />
      </Step>

      {isFinish && <Confetti />}
    </>
  )
}
