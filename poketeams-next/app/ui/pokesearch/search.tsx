'use client'
import { type PokemonURL } from '@/app/lib/definitions'
import { filterByName } from '@/app/lib/utils'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { type ReactElement } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export interface SearchProps {
  placeholder: string
  allPokemon: PokemonURL[]
}
export default function Search ({ placeholder, allPokemon }: SearchProps): ReactElement {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const handleSearch = useDebouncedCallback((query: string) => {
    const filtered = filterByName(allPokemon, query)
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
      <label htmlFor="query" className='sr-only'>
        Pokemon Search
      </label>
      <input
        id='query'
        name='query'
        role='search'
        className='bg-white rounded-xl border border-gray-300 w-full py-1 pl-8 text-sm placeholder:text-gray-500'
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
        required
      />
      <MagnifyingGlassIcon height={14} width={14} className='absolute left-3 top-[7px] text-gray-500'/>
    </form>
  )
}
