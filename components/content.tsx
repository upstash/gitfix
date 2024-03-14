import React from 'react'
import { cn } from '../lib/utils'

export interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {}

export default function Content({ className, ...props }: ContentProps) {
  return (
    <div
      className={cn(
        'flex items-center p-4 bg-zinc-50 rounded-md border border-zinc-200 shadow-sm',
        className
      )}
      {...props}
    />
  )
}
