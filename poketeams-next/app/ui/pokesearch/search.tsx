'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { type ReactElement } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export interface SearchProps {
  placeholder: string
  allPokemon: string[]
}
export default function Search ({ placeholder, allPokemon }: SearchProps): ReactElement {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((query: string) => {
  }, 300)

  function handleSubmit (e: React.FormEvent): void {
    e.preventDefault()
    const { query } = e.target as typeof e.target & { query: { value: string } }
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
    <form className='relative flex flex-1' onSubmit={handleSubmit}>
      <div className='relative w-full'>
        <input
          id='query'
          name='query'
          role='search'
          className='peer placeholder:text-transparent bg-white rounded-2xl border outline-gray-300
          border-gray-300 w-full py-3 pl-9 text-base placeholder:text-gray-500'
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          defaultValue={searchParams.get('query')?.toString()}
          required
        />
        <label htmlFor="query" className='absolute left-9 top-[1px] text-xs text-gray-400
        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-[1px] =
        peer-focus:text-xs transition-all'>
          {placeholder}
        </label>
      </div>
      <MagnifyingGlassIcon height={18} width={18} className='absolute left-3 top-4 text-gray-400'/>
    </form>
  )
}
