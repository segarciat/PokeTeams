'use client'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState, type FormEvent, type ReactElement } from 'react'

export interface SearchProps {
  placeholder: string
  defaultQuery: string
  onSubmit: (action: PokeSearchParamAction) => void
}

export default function Search ({ placeholder, defaultQuery, onSubmit }: SearchProps): ReactElement {
  const [query, setQuery] = useState(defaultQuery)

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    setQuery(e.currentTarget.value)
  }

  function handleClearInput (): void {
    setQuery('')
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    onSubmit({
      action: 'SUBMIT_QUERY',
      query
    })
  }

  return (
    <section aria-label="search options" className='my-4'>
      <form role='search' aria-label='pokesearch form' onSubmit={handleSubmit} className='relative flex flex-1 flex-col gap-2'>
        <div className='relative w-full'>
          <input
            id='query' // Matches value in label htmlFor
            name='query' // Used to access form submission element.
            className='peer placeholder:text-transparent bg-white rounded-2xl border outline-gray-300
            dark:bg-gray-600
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
        )}
        <button type='submit' className='text-white bg-primary-400 p-2 rounded-2xl flex flex-row items-center justify-center gap-2'>
          <MagnifyingGlassIcon className='inline-block' height={18} width={18} />
          Search
        </button>
      </form>
    </section>
  )
}
