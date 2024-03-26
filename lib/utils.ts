import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export enum ResultCode {
  InvalidUsername = 'INVALID_USERNAME',
  EmptyRepos = 'EMPTY_REPOS',
  Success = 'SUCCESS',
  Error = 'ERROR',
  EnvironmentError = 'ENVIRONMENT_ERROR'
}
