import { ArrowPathRoundedSquareIcon, SparklesIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { type ReactElement } from 'react'

interface ActionProps {
  isFlipped: boolean
  isShiny: boolean
  onFlipClick: () => void
  onShinyClick: () => void
}
export default function Actions ({ isFlipped, isShiny, onShinyClick, onFlipClick }: ActionProps): ReactElement {
  const actions = [
    { name: 'flip', icon: ArrowPathRoundedSquareIcon, isEnabled: isFlipped, onClick: onFlipClick },
    { name: 'toggle shiny', icon: SparklesIcon, isEnabled: isShiny, onClick: onShinyClick }
  ]
  return (
    <menu className='flex flex-col justify-center gap-1 my-1'>
      {actions.map(({ name, isEnabled, onClick, icon: Icon }) => (
        <li key={name}>
          <button aria-label={name} onClick={onClick} className={clsx('border-2 rounded-full p-2', {
            'border-primary text-primary bg-white': !isEnabled,
            'text-white bg-primary': isEnabled
          })}>
            <Icon height={20} width={20}/>
          </button>
        </li>
      ))}
    </menu>
  )
}
