'use client'

// Component: EventListTable
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon data table pattern
// NightTable usage: dashboard club events listing

import Link from 'next/link'
import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed'

export type EventListItem = {
  id: string
  title: string
  dateLabel: string
  djLineup: string[]
  availableCount: number
  totalCount: number
  status: EventStatus
}

type EventListTableProps = {
  events: EventListItem[]
}

function statusLabel(status: EventStatus): string {
  if (status === 'published') return 'Publié'
  if (status === 'cancelled') return 'Annulé'
  if (status === 'completed') return 'Terminé'
  return 'Brouillon'
}

function statusChip(status: EventStatus): { color: 'default' | 'success' | 'danger'; variant: 'flat' | 'bordered' } {
  if (status === 'published') {
    return { color: 'success', variant: 'flat' }
  }

  if (status === 'cancelled') {
    return { color: 'danger', variant: 'flat' }
  }

  if (status === 'completed') {
    return { color: 'default', variant: 'bordered' }
  }

  return { color: 'default', variant: 'flat' }
}

export function EventListTable({ events }: EventListTableProps): React.JSX.Element {
  return (
    <div className='rounded-[10px] border border-[#C9973A]/12 bg-[#12172B] p-3'>
      <Table
        removeWrapper
        aria-label='Tableau des événements du club'
        classNames={{
          th: 'bg-[#0A0F2E] text-[#888888] uppercase text-[11px] tracking-[0.05em] h-10',
          td: 'text-[#F7F6F3] h-12 border-b border-[#C9973A]/8',
          tr: 'hover:bg-[#C9973A]/5 transition-colors duration-150',
        }}
      >
        <TableHeader>
          <TableColumn>ÉVÉNEMENT</TableColumn>
          <TableColumn>DATE</TableColumn>
          <TableColumn>DJ LINEUP</TableColumn>
          <TableColumn>STATUT</TableColumn>
          <TableColumn>TABLES</TableColumn>
          <TableColumn>ACTIONS</TableColumn>
        </TableHeader>
        <TableBody emptyContent={'Aucun événement disponible'}>
          {events.map((eventItem) => {
            const status = statusChip(eventItem.status)

            return (
              <TableRow key={eventItem.id}>
                <TableCell className='font-medium'>{eventItem.title}</TableCell>
                <TableCell className='text-[#888888]'>{eventItem.dateLabel}</TableCell>
                <TableCell>
                  <div className='flex flex-wrap gap-1'>
                    {eventItem.djLineup.length > 0 ? (
                      eventItem.djLineup.map((djName, index) => (
                        <Chip key={`${eventItem.id}-dj-${index}`} size='sm' variant='bordered' color='primary'>
                          {djName}
                        </Chip>
                      ))
                    ) : (
                      <span className='text-[#888888]'>Non défini</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip color={status.color} variant={status.variant}>
                    <span className='text-[10px] uppercase tracking-[0.04em]'>{statusLabel(eventItem.status)}</span>
                  </Chip>
                </TableCell>
                <TableCell>
                  <span className='text-[#C9973A]'>{eventItem.availableCount}</span>
                  <span className='text-[#888888]'> / {eventItem.totalCount}</span>
                </TableCell>
                <TableCell>
                  <Button
                    as={Link}
                    href='/dashboard/club/events'
                    size='sm'
                    variant='light'
                    isIconOnly
                    aria-label={`Action événement ${eventItem.title}`}
                    className='text-[#C9973A]'
                  >
                    ⋯
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}