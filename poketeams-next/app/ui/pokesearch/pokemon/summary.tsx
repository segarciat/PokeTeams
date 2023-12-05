import { type Pokemon, type PokeType } from '@/app/lib/definitions'
import { POKE_TYPE_BG_CLASS, capitalize } from '@/app/lib/utils'
import { type ReactElement } from 'react'

interface SummaryProps {
  types: Pokemon['types']
  name: Pokemon['name']
}

export default function Summary ({ types, name }: SummaryProps): ReactElement {
  return <section arial-label="pokemon summary">
    <AttributeLabel text='Name' />
    <h3 className='text-center font-bold text-2xl'>{capitalize(name)}</h3>
    <hr />
    <AttributeLabel text='Types' />
    <div className='flex justify-center gap-2 my-2'>
      {types.map((type) => <TypeButton key={type.name} type={type.name} />)}
    </div>
    <hr />
  </section>
}

interface TypeButtonProps {
  type: PokeType
}

function TypeButton ({ type }: TypeButtonProps): ReactElement {
  return <button className={`${POKE_TYPE_BG_CLASS[type]} px-6 py-2 rounded-full text-white text-xs `}>
    {capitalize(type)}
  </button>
}

function AttributeLabel ({ text }: { text: string }): ReactElement {
  return <p className='text-sm text-gray-300 font-bold'>{text}</p>
}
