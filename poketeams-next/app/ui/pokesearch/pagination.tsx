'use client'
import { getPaginationNumbers } from '@/app/lib/utils'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { type FormEvent, type ReactElement } from 'react'

export const MAX_LINKS = 3

export interface PaginationProps {
  totalPages: number
  page: number
}

export default function Pagination ({ totalPages, page }: PaginationProps): ReactElement {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  function handleLinkClick (page: number): void {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  function handlePageSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const { desiredPage } = e.currentTarget.elements as typeof e.currentTarget.elements & { desiredPage: { value: number } }
    handleLinkClick(desiredPage.value)
  }

  const pageNumbers = getPaginationNumbers(page, totalPages, MAX_LINKS)

  const goToFirstPage = !pageNumbers.includes(1) &&
    (<PageLink icon={ChevronDoubleLeftIcon} page={1} label={'first page'} onClick={() => { handleLinkClick(1) }} />)

  const goToPreviousPage = page !== 1 && totalPages > MAX_LINKS &&
    (<PageLink icon={ChevronLeftIcon} page={page - 1} label={'previous page'} onClick={() => { handleLinkClick(page - 1) }}/>)

  const goToNextPage = page !== totalPages && totalPages > MAX_LINKS &&
    (<PageLink icon={ChevronRightIcon} page={page + 1} label={'next page'} onClick={() => { handleLinkClick(page + 1) }}/>)

  const goToLastPage = !pageNumbers.includes(totalPages) &&
     (<PageLink icon={ChevronDoubleRightIcon} page={totalPages} label={'last page'} onClick={() => { handleLinkClick(totalPages) }}/>)

  return (
    <nav aria-label='pagination' className='flex flex-col items-center gap-4'>
      {totalPages > 1 && (
        <ul aria-label='pagination links' className='flex flex-row gap-2'>
          {goToFirstPage}
          {goToPreviousPage}
          {pageNumbers.map((n: number) => (
            <PageLink key={n} page={n} label={`page ${n}`} current={n === page} onClick={() => { handleLinkClick(n) }} />
          ))}
          {goToNextPage}
          {goToLastPage}
        </ul>
      )}
      { totalPages > MAX_LINKS && (
        <form onSubmit={handlePageSubmit} className='flex flex-row items-center gap-2'>
          <label className='sr-only' htmlFor='desiredPage'>Page</label>
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
  label: string
  icon?: any
  current?: boolean
  onClick: () => void
}

function PageLink ({ page, label, onClick, icon: Icon = null, current = false }: PageLinkProps): ReactElement {
  return (
    <li >
      <a onClick={onClick} role='button' aria-current={current} aria-label={label}
        className={clsx(`bg-gray-200 rounded-full p-3 border border-gray-300 h-12 w-12 cursor-pointer
        flex items-center text-center justify-center text-sm`, { 'bg-primary text-white': current })}>
        {Icon !== null ? <Icon height={12} width={12} /> : page}
      </a>
    </li>
  )
}