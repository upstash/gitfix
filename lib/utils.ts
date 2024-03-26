import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixStreamText(value: string) {
  return value
    // .replace(/\s+/g, ' ') // replace multiple spaces with single space
    .replace(/↵+/g, '\n') // replace ↵ with new line
    .replace(/\t/g, ' ✓ ') // replace tab with checkmark
    .trim()
}

export enum ResultCode {
  InvalidUsername = 'INVALID_USERNAME',
  EmptyRepos = 'EMPTY_REPOS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  EnvironmentError = 'ENVIRONMENT_ERROR'
}
