import React from 'react'

export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
}

export default function IconGitFix({ ...props }: IconProps) {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="52" height="52" rx="12" fill="#10B981" />
      <rect x="4" y="4" width="44" height="24" rx="8" fill="#34D399" />
      <rect x="4" y="10" width="44" height="24" rx="8" fill="#6EE7B7" />
      <rect x="4" y="16" width="44" height="23" rx="8" fill="#A7F3D0" />
      <rect x="4" y="22" width="44" height="26" rx="8" fill="#ECFDF5" />
      <path d="M21 34.5L25.2 39L33.6 30" stroke="#059669" strokeWidth="3" strokeLinecap="round"
            strokeLinejoin="round" />
    </svg>
  )
}




