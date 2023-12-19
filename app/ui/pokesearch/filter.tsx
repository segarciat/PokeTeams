import { useState, type ReactElement, type FormEvent } from 'react'
import { POKE_TYPES, POKE_TYPE_BG_CLASS } from '@/app/lib/constants'
import { capitalize } from '@/app/lib/utils'
import PokeTypeIcon from '../type-icons'
import { type PokeSearchParamAction } from '@/app/lib/definitions'
import { type PokeType } from '@/app/lib/constants'
import clsx from 'clsx'
import { AdjustmentsHorizontalIcon, XMarkIcon } from '@heroicons/react/24/outline'

export interface FilterProps {
  defaultEnabledTypes: Set<PokeType>
  onSubmit: (action: PokeSearchParamAction) => void
}

export default function Filter ({ defaultEnabledTypes, onSubmit }: FilterProps): ReactElement {
  const [enabledTypes, setEnabledTypes] = useState(defaultEnabledTypes)
  const [showForm, setShowForm] = useState(false)

  function handleShowForm (): void {
    setShowForm(show => !show)
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
    onSubmit({
      action: 'FILTER',
      types: enabledTypes
    })
    handleShowForm()
  }

  function handleReset (): void {
    setEnabledTypes(new Set())
  }

  function handleClose (): void {
    setEnabledTypes(defaultEnabledTypes)
    handleShowForm()
  }

  return (
    <section aria-label='filters'>
      <button aria-label="openFilters" type='button' onClick={handleShowForm}
        className={`text-gray-600 bg-gray-100 border border-gray-300
          dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400
          shadow-sm p-1 rounded-lg flex flex-col items-center justify-center gap-0`}>
        <AdjustmentsHorizontalIcon height={20} width={20} />
        <span className='text-xs'>Filter</span>
      </button>
      {showForm && (
        <div className='fixed z-50 inset-0 overflow-y-scroll w-full max-h-screen flex justify-center items-center'>
          <div className='fixed inset-0 -z-10 bg-black opacity-75' />
          <form aria-label='filters' onSubmit={handleSubmit} className={'flex flex-col gap-2 p-4 z-50 bg-white w-5/6 lg:max-w-2xl'}>
            <header className='flex flex-row justify-between border-b border-b-gray-200'>
              <button type='button' aria-label='closeFilters' onClick={handleClose}><XMarkIcon height={20} width={20} /></button>
              <h2 className='text-3xl font-bold text-center'>Filters</h2>
              <button type='reset' onClick={handleReset}>Reset</button>
            </header>
            <h3 className='text-lg font-bold'>Types</h3>
            <fieldset className='flex flex-row justify-center flex-wrap gap-2'>
              {POKE_TYPES.map(type => (
                <PokeFilterBtn key={type} type={type} isEnabled={enabledTypes.has(type)} onClick={handleTypeToggle.bind(null, type)} />
              )
              )}
            </fieldset>
            <button type='submit' className=' border-2 border-gray-300 bg-primary-400 text-white rounded-xl w-full px-2 py-4'>
              Apply
            </button>
            <button type='button' onClick={handleClose} className='text-black border-2 border-gray-400 rounded-xl w-full px-2 py-4'>
              Cancel
            </button>
          </form>
        </div>
      )}
    </section>
  )
}

function PokeFilterBtn ({ type, isEnabled, onClick }: { type: PokeType, isEnabled: boolean, onClick: () => void }): ReactElement {
  return (
    <button type='button' onClick={onClick} aria-pressed={isEnabled}
      className={clsx('px-2 py-2 rounded-full text-xs w-24 transition-colors duration-500', {
        [`text-white ${POKE_TYPE_BG_CLASS[type]}`]: isEnabled,
        'text-gray-700 bg-gray-200': !isEnabled
      })}>
      <span className='flex flex-col'>
        <PokeTypeIcon pokeType={type} size="xl" />
        {capitalize(type)
      }</span>
    </button>
  )
}
