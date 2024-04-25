import React from 'react'
import { cn } from '../lib/utils'

export interface ALinkProps extends React.ComponentPropsWithoutRef<'a'> {}

export default function ALink({ className, ...props }: ALinkProps) {
  return (
    <a
      className={cn(
        'underline decoration-zinc-300 dark:decoration-zinc-700',
        'hover:decoration-zinc-700 dark:hover:decoration-zinc-400',
        'hover:text-zinc-900 dark:hover:text-zinc-50',
        className,
      )}
      {...props}
    />
  )
}
