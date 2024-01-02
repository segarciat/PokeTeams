'use client'
import PokeSearchParamsContext from '@/app/context/poke-search-params'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React, { useState, type FormEvent, type ReactElement, useContext } from 'react'

export interface SearchProps {
  placeholder: string
}

export default function Search ({ placeholder }: SearchProps): ReactElement {
  const { query, dispatch } = useContext(PokeSearchParamsContext)
  const [searchInputValue, setSearchInputValue] = useState(query)

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchInputValue(e.currentTarget.value)
  }

  function handleClearInput (): void {
    setSearchInputValue('')
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    dispatch?.('SUBMIT_QUERY', { query: searchInputValue })
  }

  return (
    <section aria-label="search options" className='my-4'>
      <form role='search' aria-label='pokesearch form' onSubmit={handleSubmit}
      className='relative flex flex-1 flex-row gap-2'>
        <div className='relative w-full'>
          {searchInputValue.length !== 0 && (
            <button aria-label='clear input' type='button' className='absolute left-3 top-4 text-gray-400' onClick={handleClearInput}>
              <XMarkIcon height={20} width={20} />
            </button>
          )}
          <input
            id='query' // Matches value in label htmlFor
            name='query' // Used to access form submission element.
            className='peer placeholder:text-transparent bg-white rounded-2xl border outline-gray-700
            dark:bg-gray-700
        border-gray-600 w-full py-3 text-base pl-8 placeholder:text-gray-'
            placeholder={placeholder}
            value={searchInputValue}
            onChange={handleChange}
          />
          <label htmlFor="query" className='absolute left-8 top-[1px] text-xs text-gray-400
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[1px] =
        peer-focus:text-xs transition-all'>
            {placeholder}
          </label>
          <button aria-label="search" type='submit'
            className='text-gray-400 p-2 rounded-full flex flex-row items-center justify-center gap-2 absolute right-3 top-2'>
            <MagnifyingGlassIcon className='inline-block' height={20} width={20} />
          </button>
        </div>
      </form>
    </section>
  )
}
