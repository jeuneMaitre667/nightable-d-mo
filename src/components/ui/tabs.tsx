// Component: Tabs
// Reference: shadcn/ui tabs
// NightTable usage: lightweight horizontal tabs for filtering

'use client'

import React, { createContext, useContext } from 'react'

interface TabsContextType {
  value: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | null>(null)

interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div data-state={value} className={className}>
        {children}
        {/* (Remplacement des couleurs dans TabsTrigger plus bas) */}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return <div className={`flex ${className}`}>{children}</div>
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const ctx = useContext(TabsContext)
  if (!ctx) return null
  const { onChange, value: current } = ctx
  const handle = () => onChange(value)

  return (
    <button
      onClick={handle}
      data-state={value === current ? 'active' : 'inactive'}
      className={`px-3 py-2 text-sm font-medium ${className} ${value === current ? 'text-[--color-fg]' : 'text-[--color-muted]'}`}
    >
      {children}
    </button>
  )
}
