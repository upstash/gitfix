import * as React from 'react'
import {
  StepContent,
  StepDesc,
  StepItem,
  StepNumber,
  StepTitle,
} from './step-list'
import store from 'store'
import PR from './pr'
import Stream from './stream'

export interface FlowStep3Props {}

export default function FlowStep3({}: FlowStep3Props) {
  const { repo, isFinish, streamText, isStream } = store()

  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Creating PR Request</StepTitle>
      <StepDesc>
        This demo processes 3 files at each run. Deploy app yourself to
        configure this.
      </StepDesc>
      {repo && (
        <StepContent>
          {isFinish && streamText.includes('Success') ? (
            <PR />
          ) : (
            <Stream isStream={isStream} streamText={streamText} />
          )}
        </StepContent>
      )}
    </StepItem>
  )
}
