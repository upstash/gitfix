'use client'

import * as React from 'react'
import { Suspense } from 'react'
import store from 'store/index'
import { Step } from './step-list'
import FlowStep1 from './flow-step-1'
import FlowStep2 from './flow-step-2'
import FlowStep3 from './flow-step-3'
import Confetti from './confetti'

export default function Flow() {
  const { isFinish } = store()

  return (
    <>
      <Step className="mt-16 md:mt-20">
        <Suspense fallback={<span>Loading...</span>}>
          {/* Github profile */}
          <FlowStep1 />
          {/* Select a repository */}
          <FlowStep2 />
          {/* Creating PR Request */}
          <FlowStep3 />
        </Suspense>
      </Step>

      {isFinish && <Confetti />}
    </>
  )
}
