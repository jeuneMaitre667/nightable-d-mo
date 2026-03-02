'use client'

// Component: CreateEventButton
// Reference: component.gallery/components/button
// Inspired by: Shopify Polaris primary action pattern
// NightTable usage: primary CTA for creating club events

import Link from 'next/link'
import { Button } from '@heroui/react'

export function CreateEventButton(): React.JSX.Element {
  return (
    <Button
      as={Link}
      href='/dashboard/club/events/new'
      color='primary'
      variant='solid'
      radius='none'
      className='h-12 w-full min-w-[220px] px-5 text-sm font-semibold tracking-[0.08em] md:w-auto'
    >
      Créer un événement
    </Button>
  )
}