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
  return <menu className='flex flex-col justify-center gap-1 my-1'>
    <ToggleAction onClick={onFlipClick} actionName='Flip Image' isToggledOn={isFlipped}>
      <ArrowPathRoundedSquareIcon height={20} width={20} />
    </ToggleAction>
    <ToggleAction onClick={onShinyClick} actionName='Toggle Shiny Image' isToggledOn={isShiny}>
      <SparklesIcon height={20} width={20}/>
    </ToggleAction>
  </menu>
}

interface ToggleActionProps {
  actionName: string
  isToggledOn: boolean
  onClick: () => void
  children: React.ReactNode
}

function ToggleAction (props: ToggleActionProps): ReactElement {
  return <button aria-label={props.actionName}
    className={clsx('border-2 rounded-full p-2', {
      'border-primary text-primary bg-white': !props.isToggledOn,
      'text-white bg-primary': props.isToggledOn
    })}
    onClick={props.onClick}
  >
    {props.children}
  </button>
}
