import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fixStreamText(value: string) {
  if (!value) return value

  return value
    .replace(/\\n\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/"+/g, '\n')
    .replace(/​/g, '')
    .trim()
}

export enum ResultCode {
  InvalidUsername = 'INVALID_USERNAME',
  EmptyRepos = 'EMPTY_REPOS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  EnvironmentError = 'ENVIRONMENT_ERROR'
}
