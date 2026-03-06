// Component: Select
// Reference: component.gallery/components/select
// Inspired by: Radix UI Select (shadcn/ui)
// NightTable usage: Tous les menus déroulants du site (filtres, formulaires, dashboard)

'use client'

import * as React from 'react'
import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'

interface SelectProps {
  /**
   * Valeur sélectionnée
   */
  value?: string
  /**
   * Callback lors du changement de valeur
   */
  onValueChange?: (value: string) => void
  /**
   * Placeholder affiché si aucune valeur sélectionnée
   */
  placeholder?: string
  /**
   * Options du select (label + value)
   */
  options: { label: string; value: string }[]
  /**
   * Désactive le select
   */
  disabled?: boolean
  /**
   * Classe CSS additionnelle
   */
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  placeholder,
  options,
  disabled,
  className,
}) => (
  <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
    <RadixSelect.Trigger
      className={`
        flex items-center justify-between w-full min-w-[140px] h-11 px-4 rounded-lg
        bg-[--color-bg-card] border border-[--color-accent]/30 text-[--color-accent] font-medium
        transition-all duration-200 outline-none
        focus:ring-2 focus:ring-[--color-accent] focus:ring-offset-2 focus:ring-offset-[--color-bg]
        aria-[expanded=true]:ring-2 aria-[expanded=true]:ring-[--color-accent]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}
      `}
      aria-label={placeholder}
    >
      <RadixSelect.Value placeholder={placeholder} />
      <RadixSelect.Icon className="ml-2">
        <ChevronDown className="w-4 h-4 text-[#C9973A] transition-transform duration-200" />
      </RadixSelect.Icon>
    </RadixSelect.Trigger>
    <RadixSelect.Portal>
      <RadixSelect.Content
        className="z-50 min-w-[140px] bg-[--color-bg-card] border border-[--color-accent]/20 rounded-lg shadow-xl mt-2 animate-fadeIn"
        position="popper"
      >
        <RadixSelect.Viewport className="p-1">
          {options.map((opt) => (
            <RadixSelect.Item
              key={opt.value}
              value={opt.value}
              className="
                  flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer
                  text-[--color-fg] hover:bg-[--color-accent]/10 focus:bg-[--color-accent]/15
                  transition-colors duration-150
                  aria-selected:bg-[--color-accent]/20
                "
            >
              <RadixSelect.ItemIndicator>
                <Check className="w-4 h-4 text-[--color-accent]" />
              </RadixSelect.ItemIndicator>
              <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
            </RadixSelect.Item>
          ))}
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  </RadixSelect.Root>
)

// Animation
// Add this to your global CSS if not présent:
// @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px);} to { opacity: 1; transform: none; } }
// .animate-fadeIn { animation: fadeIn 0.18s cubic-bezier(.16,1,.3,1); }
