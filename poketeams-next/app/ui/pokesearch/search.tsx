'use client'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useState, type FormEvent, type ReactElement } from 'react'

export interface SearchProps {
  placeholder: string
}

export default function Search ({ placeholder }: SearchProps): ReactElement {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState(searchParams?.get('query')?.toString() ?? '')

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.currentTarget.value)
  }

  function handleClearInput (): void {
    setQuery('')
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const { query } = e.currentTarget.elements as typeof e.currentTarget.elements & { query: { value: string } }
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (query.value !== '') {
      params.set('query', query.value)
    } else {
      params.delete('query')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <section aria-label="search options" className='my-4'>
      <form role='search' aria-label='pokesearch form' className='relative flex flex-1 flex-col gap-2' onSubmit={handleSubmit}>
        <div className='relative w-full'>
          <input
            id='query' // Matches value in label htmlFor
            name='query' // Used to access form submission element.
            className='peer placeholder:text-transparent bg-white rounded-2xl border outline-gray-300
        border-gray-300 w-full py-3 text-base pl-8 placeholder:text-gray-500'
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
          />
          <label htmlFor="query" className='absolute left-8 top-[1px] text-xs text-gray-400
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[1px] =
        peer-focus:text-xs transition-all'>
            {placeholder}
          </label>
        </div>
        {query.length !== 0 && (
          <button aria-label='clear input' type='button' className='absolute left-3 top-4 text-gray-400' onClick={handleClearInput}>
            <XMarkIcon height={18} width={18} />
          </button>
        )
        }
        <button type='submit' className='text-white bg-primary p-2 rounded-2xl flex flex-row items-center justify-center gap-2'>
          <MagnifyingGlassIcon className='inline-block' height={18} width={18} />
          Search
        </button>
      </form>
    </section>
  )
}
