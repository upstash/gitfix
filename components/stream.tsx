import * as React from 'react'
import { cn, fixStreamText } from 'lib/utils'
import Content, { ContentProps } from './content'
import { LoaderCircle } from 'lucide-react'
import Markdown from 'markdown-to-jsx'
import { StoreState } from '../store'

export interface PRProps extends ContentProps {
  streamText: StoreState['streamText']
  isStream: StoreState['isStream']
}

export default function Stream({ streamText, isStream }: PRProps) {
  return (
    <Content className={cn('px-6')}>
      <pre
        className={cn(
          'w-full whitespace-pre-wrap text-pretty',
          'font-mono text-[.94rem] leading-relaxed',
          streamText.includes('Success') && '',
          streamText.includes('Info') && '',
          streamText.includes('Error') && 'bg-red-50',
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
              a: ({ children }) => (
                <a className="cursor-pointer font-semibold underline">
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <div className="bg-red-100">{children}</div>
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
