'use client'
import { POKE_TYPE_BG_CLASS, type PokeType } from '@/app/lib/constants'
import { useContext, type ReactElement } from 'react'
import PokeTypeTag from '../utils/poke-type-tags'
import { XMarkIcon } from '@heroicons/react/24/outline'
import PokeSearchParamsContext from '@/app/context/poke-search-params'

export default function ActiveFilters (): ReactElement {
  const { query, types, dispatch } = useContext(PokeSearchParamsContext)

  function handleTypeClick (type: PokeType): void {
    const newTypes = new Set(types)
    newTypes.delete(type)
    dispatch?.('FILTER', { types: newTypes })
  }

  function handleQueryClick (): void {
    dispatch?.('SUBMIT_QUERY', { query: '' })
  }

  return (
    <ul aria-label='activeFilters' className='flex flex-row flex-wrap gap-2 items-center my-2'>
      {query.length > 0 && (
        <button type='button' onClick={handleQueryClick} className='flex flex-row items-center gap-2 bg-gray-200 dark:bg-gray-600 py-3 px-4 rounded-full'>
          {query} <XMarkIcon height={12} width={12} />
        </button>
      )}
      {types.size > 0 && (
        Array.from(types).map(type => (
          <button key={type} onClick={handleTypeClick.bind(null, type)} type='button'
            className={`px-4 py-2 ${POKE_TYPE_BG_CLASS[type]} rounded-full text-white flex flex-row items-center
            justify-center gap-2 text-sm`}
          >
            <PokeTypeTag pokeType={type} />
            <XMarkIcon height={16} width={16} />
          </button>
        ))
      )}
    </ul>
  )
}
