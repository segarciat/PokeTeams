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
          <button aria-label={name} onClick={onClick} className={clsx('border-2 border-gray-300 text-gray-400 dark:text-white rounded-full p-2', {
            'text-gray-900 bg-primary-300 dark:bg-primary-400': isEnabled
          })}>
            <Icon height={20} width={20}/>
          </button>
        </li>
      ))}
    </menu>
  )
}
