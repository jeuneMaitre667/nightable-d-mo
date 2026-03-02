'use client'

// Component: TablesSkeleton
// Reference: component.gallery/components/table
// Inspired by: IBM Carbon loading table pattern
// NightTable usage: loading state for club tables management

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react'

type TablesSkeletonProps = {
  rows?: number
}

export function TablesSkeleton({ rows = 7 }: TablesSkeletonProps): React.JSX.Element {
  return (
    <div className='rounded-xl border border-[#C9973A]/20 bg-[#12172B] p-4'>
      <Table
        removeWrapper
        aria-label='Chargement des tables'
        classNames={{
          th: 'bg-[#0A0F2E] text-[#888888] uppercase text-[11px] tracking-[0.05em]',
          td: 'text-[#F7F6F3] border-b border-[#C9973A]/8',
        }}
      >
        <TableHeader>
          <TableColumn>TABLE</TableColumn>
          <TableColumn>ZONE</TableColumn>
          <TableColumn>PROMO</TableColumn>
          <TableColumn>PRIX</TableColumn>
          <TableColumn>ACTION</TableColumn>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={`tables-skeleton-${index}`}>
              <TableCell><Skeleton className='h-4 w-36 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-16 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-12 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-4 w-20 rounded bg-[#2A2F4A]' /></TableCell>
              <TableCell><Skeleton className='h-8 w-8 rounded bg-[#2A2F4A]' /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}