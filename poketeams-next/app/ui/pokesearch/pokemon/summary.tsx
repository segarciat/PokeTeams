import { type Pokemon } from '@/app/lib/definitions'
import { POKE_TYPE_BG_CLASS, capitalize } from '@/app/lib/utils'
import { type ReactElement } from 'react'

interface SummaryProps {
  types: Pokemon['types']
  name: Pokemon['name']
}

const attributeTitleClass = 'text-sm text-gray-300 font-bold'

export default function Summary ({ types, name }: SummaryProps): ReactElement {
  return (
    <section arial-label="pokemon summary">
      <h3 className={attributeTitleClass}>Name</h3>
      <p className='text-center font-bold text-2xl'>{capitalize(name)}</p>
      <hr />
      <h3 className={attributeTitleClass}>Types</h3>
      <ul className='flex justify-center gap-2 my-2'>
        {types.map((type) => (
          <li key={type.name}>
            <button className={`${POKE_TYPE_BG_CLASS[type.name]} px-6 py-2 rounded-full text-white text-xs `}>
              {capitalize(type.name)}
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </section>
  )
}
