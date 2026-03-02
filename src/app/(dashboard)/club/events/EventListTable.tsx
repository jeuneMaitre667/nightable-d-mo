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
    <>
      <div className='flex flex-col gap-3 md:hidden'>
        {events.map((eventItem) => {
          const status = statusChip(eventItem.status)

          return (
            <article key={`mobile-${eventItem.id}`} className='rounded-xl border border-white/5 bg-[#1A1D24] p-4'>
              <div className='mb-3 flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-medium text-[#F7F6F3]'>{eventItem.title}</p>
                  <p className='text-xs text-[#888888]'>{eventItem.dateLabel}</p>
                </div>
                <Chip size='sm' color={status.color} variant={status.variant}>
                  <span className='text-[10px] uppercase tracking-[0.04em]'>{statusLabel(eventItem.status)}</span>
                </Chip>
              </div>

              <div className='flex items-center justify-between text-sm'>
                <span className='text-[#888888]'>Tables disponibles</span>
                <span className='font-medium text-[#F7F6F3]'>
                  <span className='text-[#C9973A]'>{eventItem.availableCount}</span>
                  <span className='text-[#888888]'> / {eventItem.totalCount}</span>
                </span>
              </div>

              <div className='mt-3 flex items-center justify-between gap-2'>
                <p className='truncate text-xs text-[#888888]'>
                  {eventItem.djLineup.length > 0 ? eventItem.djLineup.join(' • ') : 'DJ lineup non défini'}
                </p>
                <Button
                  as={Link}
                  href={`/dashboard/club/events/new?duplicate=${eventItem.id}`}
                  size='sm'
                  variant='light'
                  className='min-h-11 min-w-[44px] text-[#C9973A]'
                  aria-label={`Dupliquer l'événement ${eventItem.title}`}
                >
                  Dupliquer
                </Button>
              </div>
            </article>
          )
        })}
      </div>

      <div className='hidden rounded-xl border border-white/5 bg-[#1A1D24] p-4 md:block'>
        <Table
          removeWrapper
          aria-label='Tableau des événements du club'
          classNames={{
            th: 'bg-[#111318] text-[#888888] uppercase text-[11px] tracking-[0.05em] h-11',
            td: 'text-[#F7F6F3] h-14 border-b border-white/5',
            tr: 'hover:bg-[#C9973A]/6 transition-colors duration-150',
          }}
        >
          <TableHeader>
            <TableColumn>ÉVÉNEMENT</TableColumn>
            <TableColumn>DATE</TableColumn>
            <TableColumn className='hidden lg:table-cell'>DJ LINEUP</TableColumn>
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
                  <TableCell className='hidden lg:table-cell'>
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
                      href={`/dashboard/club/events/new?duplicate=${eventItem.id}`}
                      size='sm'
                      variant='light'
                      isIconOnly
                      aria-label={`Dupliquer l'événement ${eventItem.title}`}
                      className='min-h-11 min-w-[44px] text-[#C9973A]'
                    >
                      ⧉
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}