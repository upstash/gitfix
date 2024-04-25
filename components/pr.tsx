import * as React from 'react'
import { cn } from 'lib/utils'
import Content, { ContentProps } from './content'
import { Button } from './ui/button'

export interface PRProps extends ContentProps {}

export default function PR({}: PRProps) {
  return (
    <Content
      asChild
      className={cn(
        'border-emerald-500/40 bg-emerald-500/10 text-emerald-800',
        'dark:border-emerald-900 dark:bg-emerald-800/10 dark:text-emerald-200',
      )}
    >
      <a href={''} target="_blank">
        <span
          className="flex size-8 items-center
        justify-center rounded-full
        bg-emerald-800 text-white
        dark:bg-emerald-100 dark:text-emerald-900"
        >
          <svg
            className="fill-current"
            viewBox="0 0 16 16"
            width="18"
            height="18"
          >
            <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z" />
          </svg>
        </span>

        <div className="grow">
          <h4 className="font-semibold">
            GitFix: Fixing grammar errors in md and mdx files
          </h4>
          <p className="opacity-70 dark:opacity-60">
            #561 opened now by GitFix
          </p>
        </div>

        <Button size="sm">Review</Button>
      </a>
    </Content>
  )
}
