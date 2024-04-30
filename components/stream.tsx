import * as React from 'react'
import { cn, fixStreamText } from 'lib/utils'
import Content, { ContentProps } from './content'
import { LoaderCircle } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import { StoreState } from '../store'
import PR from './pr'

export interface PRProps extends ContentProps {
  streamText: StoreState['streamText']
  isStream: StoreState['isStream']
}

export default function Stream({ streamText, isStream }: PRProps) {
  return (
    <Content
      className={cn(
        'px-6',
        // streamText.includes('Success') &&
        //   'border-emerald-200 bg-emerald-500/10 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-500/10',
        // streamText.includes('Info') &&
        //   'border-blue-200 bg-blue-500/10 text-blue-600 dark:border-blue-900 dark:bg-blue-500/10',
        streamText.includes('Error') &&
          'border-red-200 bg-red-500/10 text-red-600 dark:border-red-900 dark:bg-red-500/10',
      )}
    >
      <pre
        className={cn(
          'w-full whitespace-pre-wrap text-pretty',
          'font-mono text-[.94rem] leading-relaxed',
        )}
      >
        <Markdown
          options={{
            overrides: {
              ul: ({ children }) => (
                <ol className="ml-4 line-clamp-3 list-inside list-disc font-semibold">
                  {children}
                </ol>
              ),
              blockquote: ({ children }) => (
                <PR url={children} className="mt-8" />
              ),
            },
          }}
        >
          {fixStreamText(streamText)}
        </Markdown>

        {isStream && <Loading />}
      </pre>
    </Content>
  )
}

export function Loading() {
  return (
    <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-500">
      <LoaderCircle size={18} className="animate-spin" />
      Processing...
    </span>
  )
}
