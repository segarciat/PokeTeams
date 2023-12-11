'use client'
import { getPaginationNumbers } from '@/app/lib/utils'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { type FormEvent, type ReactElement } from 'react'
import { type PokeSearchParamAction } from '@/app/lib/definitions'

export const MAX_LINKS = 3

export interface PaginationProps {
  totalPages: number
  page: number
  onPageClick: (action: PokeSearchParamAction) => void
}

export default function Pagination ({ totalPages, page, onPageClick }: PaginationProps): ReactElement {
  function handleLinkClick (page: number): void {
    onPageClick?.({
      action: 'NEW_PAGE',
      page
    })
  }

  function handlePageSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const { desiredPage } = e.currentTarget.elements as typeof e.currentTarget.elements & { desiredPage: { value: string } }
    handleLinkClick(Number(desiredPage.value))
  }

  const pageNumbers = getPaginationNumbers(page, totalPages, MAX_LINKS)

  const goToFirstPage = !pageNumbers.includes(1) &&
    (<PageLink icon={ChevronDoubleLeftIcon} page={1} rel={'first'} onClick={() => { handleLinkClick(1) }} />)

  const goToPreviousPage = page !== 1 && totalPages > MAX_LINKS &&
    (<PageLink icon={ChevronLeftIcon} page={page - 1} rel={'previous'} onClick={() => { handleLinkClick(page - 1) }}/>)

  const goToNextPage = page !== totalPages && totalPages > MAX_LINKS &&
    (<PageLink icon={ChevronRightIcon} page={page + 1} rel={'next'} onClick={() => { handleLinkClick(page + 1) }}/>)

  const goToLastPage = !pageNumbers.includes(totalPages) &&
     (<PageLink icon={ChevronDoubleRightIcon} page={totalPages} rel={'last'} onClick={() => { handleLinkClick(totalPages) }}/>)

  return (
    <nav aria-label='pagination' className='flex flex-col items-center gap-4'>
      {totalPages > 1 && (
        <ul aria-label='pagination links' className='flex flex-row gap-2'>
          {goToFirstPage}
          {goToPreviousPage}
          {pageNumbers.map((n: number) => (
            <PageLink key={n} page={n} current={n === page} onClick={() => { handleLinkClick(n) }} />
          ))}
          {goToNextPage}
          {goToLastPage}
        </ul>
      )}
      { totalPages > MAX_LINKS && (
        <form onSubmit={handlePageSubmit} className='flex flex-row items-center gap-2'>
          <label className='sr-only' htmlFor='desiredPage'>Desired Page</label>
          <input required id='desiredPage' name='page' type="number" defaultValue={page} min={1} max={totalPages}
            className='border border-gray-400 text-center rounded-md p-1 h-10'
          /> of {totalPages}
          <button type="submit" className='p-2 text-sm bg-primary text-white border rounded-xl'>Go</button>
        </form>
      )}
    </nav>
  )
}

interface PageLinkProps {
  page: number
  rel?: string
  icon?: any
  current?: boolean
  onClick: () => void
}

function PageLink ({ page, rel, onClick, icon: Icon = null, current = false }: PageLinkProps): ReactElement {
  return (
    <li>
      <a onClick={current ? (e) => { e.preventDefault() } : onClick} aria-current={current} rel={rel} aria-label={rel}
        className={clsx(`bg-gray-200 rounded-full p-3 border border-gray-300 h-12 w-12
        flex items-center text-center justify-center text-sm cursor-pointer `, { 'bg-primary text-white pointer-events-none': current })}>
        {Icon !== null ? <Icon height={12} width={12} /> : page}
      </a>
    </li>
  )
}
