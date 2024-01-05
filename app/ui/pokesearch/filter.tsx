'use client'
import { useState, type ReactElement, type FormEvent, useContext } from 'react'
import { POKE_SEARCH_SORT_KEYS, POKE_TYPES, POKE_TYPE_BG_CLASS, type PokeSearchSortKey, type PokeType } from '@/app/lib/constants'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import PokeTypeTag from '../utils/poke-type-tags'
import clsx from 'clsx'
import PokeSearchParamsContext, { DEFAULT_POKE_SEARCH_PARAMS } from '@/app/context/poke-search-params'
import { capitalize } from '@/app/lib/utils'

export interface FilterProps {
  defaultEnabledTypes: Set<PokeType>
  onSubmit: (action: PokeSearchParamAction) => void
}

export default function Filter (): ReactElement {
  const { types, sort: defaultSort, dispatch } = useContext(PokeSearchParamsContext)
  const [enabledTypes, setEnabledTypes] = useState(types)
  const [sortBy, setSortBy] = useState(defaultSort ?? DEFAULT_POKE_SEARCH_PARAMS.sort)
  const [showForm, setShowForm] = useState(false)

  function handleShowForm (): void {
    setShowForm(show => !show)
    setEnabledTypes(types)
    document.body.classList.toggle('overflow-y-hidden')
  }

  function handleTypeToggle (type: PokeType): void {
    const updatedEnabledTypes = new Set(enabledTypes)
    if (updatedEnabledTypes.has(type)) {
      updatedEnabledTypes.delete(type)
    } else {
      updatedEnabledTypes.add(type)
    }
    setEnabledTypes(updatedEnabledTypes)
  }

  function handleSubmit (e: FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    dispatch?.('FILTER', { types: enabledTypes, sort: sortBy })
    handleShowForm()
    toast.success('Filters applied!')
  }

  function handleReset (): void {
    setEnabledTypes(DEFAULT_POKE_SEARCH_PARAMS.types)
    setSortBy(DEFAULT_POKE_SEARCH_PARAMS.sort)
  }

  function handleClose (): void {
    setEnabledTypes(types)
    setSortBy(defaultSort)
    handleShowForm()
  }

  return (
    <section aria-label='filters'>
      <button aria-label="openFilters" type='button' onClick={handleShowForm}
        className={`text-gray-600 bg-gray-100 border border-gray-300
          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
          shadow-sm p-1 rounded-lg flex flex-col items-center justify-center gap-0 w-full`}>
        <AdjustmentsHorizontalIcon height={20} width={20} />
        <span className='text-xs'>Filter</span>
      </button>
      {showForm && (
        <div className='fixed z-50 inset-0 w-full flex justify-center items-center'>
          <div className='fixed inset-0 -z-10 bg-black opacity-75' />
          <form aria-label='filters' onSubmit={handleSubmit} className={'flex flex-col gap-2 p-4 z-50 overflow-y-scroll bg-white dark:bg-primary-900 w-5/6 lg:max-w-2xl max-h-screen'}>
            <header className='flex flex-row justify-between border-b border-b-gray-200'>
              <button type='button' aria-label='closeFilters' onClick={handleClose}><XMarkIcon height={20} width={20} /></button>
              <h2 className='text-3xl font-bold text-center'>Filters</h2>
              <button type='reset' onClick={handleReset}>Reset</button>
            </header>
            <h3 className='text-lg font-bold'>Types</h3>
            <fieldset className='flex flex-row justify-center flex-wrap gap-2'>
              {POKE_TYPES.map(type => (
                <PokeTypeButton key={type} type={type} isEnabled={enabledTypes.has(type)} onClick={handleTypeToggle.bind(null, type)} />
              )
              )}
            </fieldset>
            <span className='text-lg font-bold'>Sort By</span>
            <PokeSortFields sort={sortBy} handleSortChange={setSortBy} />
            <button type='submit' className=' border-2 border-gray-300 bg-primary-400 text-white rounded-xl w-full px-2 py-4'>
              Apply
            </button>
            <button type='button' onClick={handleClose} className='text-black dark:text-white dark:bg-gray-600 border-2 border-gray-400 rounded-xl w-full px-2 py-4'>
              Cancel
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

function PokeTypeButton ({ type, isEnabled, onClick }: { type: PokeType, isEnabled: boolean, onClick: () => void }): ReactElement {
  return (
    <button type='button' onClick={onClick} aria-pressed={isEnabled}
      className={clsx('text-sm p-2 rounded-full w-28 transition-colors duration-500', {
        [`text-white ${POKE_TYPE_BG_CLASS[type]}`]: isEnabled,
        'text-gray-700 bg-gray-200 dark:bg-gray-600 dark:text-white': !isEnabled
      })}>
      <PokeTypeTag pokeType={type} />
    </button>
  )
}

function PokeSortFields ({ sort, handleSortChange }: { sort: PokeSearchSortKey, handleSortChange: (key: PokeSearchSortKey) => void }): ReactElement {
  return (
    <fieldset aria-label='sortFields'>
      {POKE_SEARCH_SORT_KEYS.map(sortKey => (
        <label key={sortKey + sort} id={`sortBy${sortKey}`} className='flex flex-row items-center gap-1 mx-3'>
          <input type="radio" aria-labelledby={`sortBy${sortKey}`} name='sort' checked={sort === sortKey} value={sortKey} onChange={handleSortChange.bind(null, sortKey)}
            className='accent-primary'
          />
          {capitalize(sortKey)}
        </label>
      ))}
    </fieldset>
  )
}
