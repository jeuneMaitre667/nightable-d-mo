'use client'

// Component: EventTableSkeleton
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon loading table pattern
// NightTable usage: loading state with skeleton cells for club events table

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

type EventTableSkeletonProps = {
  rows?: number
}

export function EventTableSkeleton({ rows = 6 }: EventTableSkeletonProps): React.JSX.Element {
  return (
    <div className='rounded-[10px] border border-[#C9973A]/12 bg-[#12172B] p-3'>
      <Table
        removeWrapper
        aria-label='Chargement des événements'
        classNames={{
          th: 'bg-[#0A0F2E] text-[#888888] uppercase text-[11px] tracking-[0.05em] h-10',
          td: 'text-[#F7F6F3] h-12 border-b border-[#C9973A]/8',
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
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={`event-skeleton-${index}`}>
              <TableCell><Skeleton className='h-4 w-40 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-32 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-48 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-20 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-16 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-8 w-8 rounded bg-[#2A2F4A]' /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}