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
        className="w-full text-[.94rem] leading-relaxed
      font-mono text-pretty whitespace-pre-wrap"
      >
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
