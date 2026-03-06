// Component: Input
// Reference: shadcn/ui input
// NightTable usage: single-line text field with dark luxury styling

'use client'

import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`block w-full rounded-lg bg-[--color-bg-secondary] border border-[--color-border] px-3 py-2 text-[--color-fg] placeholder-[--color-muted] focus:border-[--color-accent] focus:ring-2 focus:ring-[--color-accent]/15 outline-none ${className}`}
      {...props}
    />
  )
}
