import * as React from 'react'
import { cn } from 'lib/utils'

export interface StepProps extends React.ComponentPropsWithoutRef<'div'> {}

const Step = ({ className, ...props }: StepProps) => {
  return <div className={cn('[counter-reset:step]', className)} {...props} />
}
Step.displayName = 'Step'

export interface StepItemProps extends React.ComponentPropsWithoutRef<'div'> {}

const StepItem = ({ className, ...props }: StepItemProps) => {
  return (
    <div
      className={cn(
        'relative ml-4 pb-16 border-l border-l-zinc-200 dark:border-l-zinc-900 pl-8 last:pb-0',
        className
      )}
      {...props}
    />
  )
}
StepItem.displayName = 'StepItem'

export interface StepNumberProps
  extends React.ComponentPropsWithoutRef<'span'> {}

const StepNumber = ({ className, ...props }: StepNumberProps) => {
  return (
    <span className="absolute left-0 top-0 h-8">
      <span
        className={cn(
          'step-item',
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          'size-10 flex items-center justify-center',
          'text-center font-mono',
          'bg-zinc-100 dark:bg-zinc-900 rounded-full',
          'border-4 border-white dark:border-zinc-950',
          className
        )}
        {...props}
      />
    </span>
  )
}
StepNumber.displayName = 'StepNumber'

export interface StepTitleProps extends React.ComponentPropsWithoutRef<'h3'> {}

const StepTitle = ({ className, ...props }: StepTitleProps) => {
  return <h3 className={cn('font-semibold text-lg', className)} {...props} />
}
StepTitle.displayName = 'StepTitle'

export interface StepContentProps
  extends React.ComponentPropsWithoutRef<'div'> {}

const StepContent = ({ className, ...props }: StepContentProps) => {
  return <div className={cn('mt-4', className)} {...props} />
}
StepContent.displayName = 'StepContent'

export { Step, StepItem, StepNumber, StepTitle, StepContent }
