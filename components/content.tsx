import React from 'react'
import { cn } from '../lib/utils'
import { Slot } from '@radix-ui/react-slot'

export interface ContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean
}

export default function Content({
  className,
  asChild,
  ...props
}: ContentProps) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5',
        'bg-zinc-50 dark:bg-zinc-900/60',
        'border border-zinc-200 dark:border-zinc-800/80',
        'rounded-xl shadow-sm',
        className,
      )}
      {...props}
    />
  )
}
