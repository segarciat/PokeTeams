import { Bars3Icon, MoonIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { type ReactElement } from 'react'

export interface NavActionsProps {
  isNavMenuOpen: boolean
  onOpenNavMenu: () => void
  onCloseNavMenu: () => void
}

export default function NavActions (props: NavActionsProps): ReactElement {
  return <menu aria-label="Site actions" className="flex flex-row gap-2">
    <li className='flex items-center'>
      <button aria-label="Use Dark Mode"> <MoonIcon height={24} width={24} /></button>
    </li>
    <li className='lg:hidden flex items-center'>
      {props.isNavMenuOpen
        ? <button aria-label="Close Nav Menu" onClick={props.onCloseNavMenu}>
          <XMarkIcon height={24} width={24} />
        </button>
        : <button aria-label="Open Nav Menu" onClick={props.onOpenNavMenu}>
          <Bars3Icon height={24} width={24} />
        </button>
      }
    </li>
  </menu>
}
