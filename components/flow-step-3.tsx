'use client'

import * as React from 'react'
import {
  StepContent,
  StepDesc,
  StepItem,
  StepNumber,
  StepTitle
} from './step-list'
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
      <StepDesc>
        This demo processes 3 files at each run. Deploy app yourself to
        configure this.
      </StepDesc>
      {repo && (
        <StepContent>
          {isFinish && streamText.includes('Success') ? (
            <Content className="p-0 border-0 bg-transparent">
              <a
                href=""
                className={cn(
                  'flex items-center gap-4 p-5 w-full rounded-xl border',
                  'bg-emerald-500/5 text-emerald-800 border-emerald-500/30',
                  'dark:bg-emerald-800/10 dark:text-emerald-200 dark:border-emerald-900'
                )}
              >
                <span className="size-8 rounded-full flex items-center justify-center dark:bg-emerald-900">
                  <svg
                    className="fill-emerald-200"
                    viewBox="0 0 16 16"
                    width="20"
                    height="20"
                  >
                    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
                  </svg>
                </span>

                <div>
                  <h4 className="font-semibold">
                    GitFix: Fixing grammar errors in md and mdx files
                  </h4>
                  <p className="text-sm opacity-60">
                    #561 opened now by GitFix
                  </p>
                </div>
              </a>
            </Content>
          ) : (
            <Content className={cn('px-6')}>
              <pre className="w-full text-[.94rem] leading-relaxed font-mono text-pretty whitespace-pre-wrap">
                <Markdown
                  options={{
                    overrides: {
                      ul: ({ children }) => (
                        <ol className="list-disc line-clamp-3 list-inside ml-4 font-semibold">
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
              </pre>
            </Content>
          )}
        </StepContent>
      )}
    </StepItem>
  )
}
