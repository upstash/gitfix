import * as React from 'react'
import {
  StepContent,
  StepDesc,
  StepItem,
  StepNumber,
  StepTitle
} from './step-list'
import { StoreState } from '../store'
import PR from './pr'
import Stream from './stream'

export interface FlowStep3Props
  extends Pick<StoreState, 'repo' | 'streamText' | 'isStream' | 'isFinish'> {}

export default function FlowStep3({
  repo,
  streamText,
  isStream,
  isFinish
}: FlowStep3Props) {
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
