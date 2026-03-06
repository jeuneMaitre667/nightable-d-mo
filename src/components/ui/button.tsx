// Component: Button
// Reference: shadcn/ui button
// Inspired by: NightTable primary/secondary button variants
// NightTable usage: used on reservations page for actions

'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'outline' | 'ghost'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', className = '', asChild = false, children, ...props },
    ref
  ) => {
    const base = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200'
    let variantClass = ''
    switch (variant) {
      case 'primary':
        variantClass = 'bg-[--color-accent] text-[--color-bg] hover:brightness-110'
        break
      case 'outline':
        variantClass = 'border border-[--color-accent] text-[--color-accent] hover:bg-[--color-accent]/10'
        break
      case 'ghost':
        variantClass = 'bg-transparent text-[--color-fg] hover:bg-[--color-accent]/10'
        break
      default:
        variantClass = 'bg-[--color-bg-secondary] text-[--color-fg]'
    }
    if (asChild) {
      // Render children directly, do not wrap in Fragment with className
      return <>{children}</>
    }
    return (
      <button
        className={`${base} ${variantClass} ${className}`.trim()}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
);
Button.displayName = 'Button';
export { Button };
