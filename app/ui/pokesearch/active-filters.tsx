'use client'
import TypesParamContext from '@/app/context/poke-types-param'
import { POKE_TYPE_BG_CLASS, type PokeType } from '@/app/lib/constants'
import { useContext, type ReactElement } from 'react'
import PokeTypeTag from '../poke-type-tags'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function ActiveFilters (): ReactElement {
  const { types, setTypes } = useContext(TypesParamContext)

  function handleTypeClick (type: PokeType): void {
    const newFilters = new Set(types)
    newFilters.delete(type)
    setTypes(newFilters)
  }

  return (
    <ul aria-label='activeFilters' className='flex flex-row flex-wrap gap-2 items-center my-2'>
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
