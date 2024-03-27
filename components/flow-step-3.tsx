'use client'

import * as React from 'react'
import { StepContent, StepItem, StepNumber, StepTitle } from './step-list'
import { cn, fixStreamText } from 'lib/utils'
import Content from './content'
import { LoaderCircle } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import store from 'store/index'

export default function FlowStep3() {
  const { repo, streamText, isStream, isFinish } = store()

  return (
    <StepItem>
      <StepNumber />
      <StepTitle>Creating PR Request</StepTitle>
      {repo && (
        <StepContent>
          <Content
            className={cn(
              'px-6',
              streamText.includes('Error:') &&
                'bg-red-500/5 text-red-800 border-red-500/30 dark:bg-red-500/5 dark:text-red-400 dark:border-red-500/20',
              streamText.includes('Success:') &&
                'bg-emerald-500/5 text-emerald-800 border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20'
            )}
          >
            <pre className="w-full font-mono text-pretty whitespace-pre-wrap">
              <Markdown
                options={{
                  overrides: {
                    ul: ({ children }) => (
                      <ol className="list-disc list-inside ml-4 font-semibold">
                        {children}
                      </ol>
                    )
                  }
                }}
              >
                {fixStreamText(streamText)}
              </Markdown>

              {isStream && (
                <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Processing...
                </span>
              )}

              {isFinish && streamText.includes('Success') && (
                <p className="mt-4">
                  <a
                    className="block py-1 px-3 rounded
                    bg-emerald-800 text-emerald-50"
                    href={repo.html_url}
                    target="_blank"
                  >
                    → {repo.html_url.replace('https://', '')}
                  </a>
                </p>
              )}
            </pre>
          </Content>
        </StepContent>
      )}
    </StepItem>
  )
}
