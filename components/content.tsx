import React from 'react'
import { cn } from '../lib/utils'

export interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Content({ className, ...props }: ContentProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-4',
        'bg-zinc-50 dark:bg-zinc-900',
        'border border-zinc-200 dark:border-zinc-800',
        'rounded-md shadow-sm',
        className
      )}
      {...props}
    />
  )
}
