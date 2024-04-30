import * as React from 'react'
import {
  StepContent,
  StepDesc,
  StepItem,
  StepNumber,
  StepTitle,
} from './step-list'
import store from 'store'
import Stream from './stream'

export interface FlowStep3Props {}

export default function FlowStep3({}: FlowStep3Props) {
  const { repo, setFinish, streamText, isStream } = store()

  // Success:
  // Info:
  // Error:

  React.useEffect(() => {
    if (streamText.includes('Success:')) {
      setFinish(true)
    }
  }, [streamText])

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
          <Stream isStream={isStream} streamText={streamText} />
        </StepContent>
      )}
    </StepItem>
  )
}
