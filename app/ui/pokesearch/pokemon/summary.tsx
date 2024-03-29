import { useContext, type ReactElement } from 'react'
import { type Pokemon } from '@/app/lib/definitions'
import { capitalize } from '@/app/lib/utils'
import PokeTypeTag from '../../utils/poke-type-tags'
import { POKE_TYPE_BG_CLASS, type PokeType } from '@/app/lib/constants'
import PokeSearchParamsContext from '@/app/context/poke-search-params'

interface SummaryProps {
  types: Pokemon['types']
  name: Pokemon['name']
}

const attributeTitleClass = 'text-sm text-gray-300 font-bold'

export default function Summary ({ types, name }: SummaryProps): ReactElement {
  const { dispatch } = useContext(PokeSearchParamsContext)

  function handleTypeClick (type: PokeType): void {
    dispatch?.('FILTER', { types: new Set<PokeType>([type]) })
  }

  return (
    <section arial-label="pokemon summary">
      <h3 className={attributeTitleClass}>Name</h3>
      <p className='text-center font-bold text-2xl'>{capitalize(name)}</p>
      <hr />
      <h3 className={attributeTitleClass}>Types</h3>
      <ul className='flex justify-center gap-2 my-2'>
        {types.map((type) => (
          <li key={type.name}>
            <button onClick={handleTypeClick.bind(null, type.name)} className={`px-4 py-2 ${POKE_TYPE_BG_CLASS[type.name]} text-white rounded-full text-sm`}>
              <PokeTypeTag pokeType={type.name}/>
            </button>
          </li>
        ))}
      </ul>
      <hr />
    </section>
  )
}
