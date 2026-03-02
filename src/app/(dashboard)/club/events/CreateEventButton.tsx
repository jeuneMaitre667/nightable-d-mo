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
      className='min-h-11 uppercase tracking-widest text-xs'
    >
      Créer un événement
    </Button>
  )
}