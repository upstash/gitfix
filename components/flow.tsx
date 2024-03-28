'use client'

import * as React from 'react'
import { useFormState } from 'react-dom'
import { useToast } from './ui/use-toast'
import store from 'store/index'
import { getRepositories } from 'app/actions'
import { Step } from './step-list'
import FlowStep1 from './flow-step-1'
import FlowStep2 from './flow-step-2'
import FlowStep3 from './flow-step-3'
import { ResultCode } from '../lib/utils'
import Confetti from './confetti'

export default function Flow() {
  const { toast } = useToast()

  const [result, dispatch] = useFormState(getRepositories, {
    repos: [],
    type: ResultCode.EmptyRepos
  })
  const {
    user,
    streamText,
    isFinish,
    setFinish,
    setRepos,
    setUser,
    onReset,
    repo,
    isStream,
    query,
    setQuery,
    repos,
    setRepo,
    fixRepo
  } = store()

  React.useEffect(() => {
    onReset()

    if (!result) return

    if (result.type === ResultCode.EnvironmentError) {
      toast({
        variant: 'destructive',
        title: 'Environment Error',
        description: 'Please set the GITHUB_TOKEN environment variable'
      })
    }

    if (result.type === ResultCode.Error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch repositories'
      })
    }

    if (result.type === ResultCode.Success) {
      setRepos(result.repos)
      setUser(result.repos[0].owner)
    }
  }, [result])

  React.useEffect(() => {
    // possible success messages:
    // - Success: Creating PR request.
    // - All grammar errors in the repository are previously corrected by GitFix.
    if (
      streamText.includes('Success:') ||
      streamText.includes('previously corrected')
    ) {
      setFinish(true)
    }
  }, [streamText])

  // React.useEffect(() => {
  //   if (process.env.NODE_ENV !== 'development') return
  //
  //   const formData = new FormData()
  //   formData.append('username', 'upstash')
  //   dispatch(formData)
  // }, [])

  return (
    <>
      <Step className="mt-16 md:mt-20">
        {/* Github profile */}
        <FlowStep1 user={user} dispatch={dispatch} />
        {/* Select a repository */}
        <FlowStep2
          query={query}
          repo={repo}
          setQuery={setQuery}
          repos={repos}
          user={user}
          setRepo={setRepo}
          fixRepo={fixRepo}
        />
        {/* Creating PR Request */}
        <FlowStep3
          repo={repo}
          streamText={streamText}
          isStream={isStream}
          isFinish={isFinish}
        />
      </Step>

      {isFinish && <Confetti />}
    </>
  )
}
