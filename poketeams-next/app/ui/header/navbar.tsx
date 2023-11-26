'use client'

import { type ReactElement, type Dispatch, type SetStateAction } from 'react'
import {
  Bars3Icon,
  MoonIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Logo from './logo'
import NavLinks from './nav-links'

export interface NavbarProps {
  title: string
  isNavMenuOpen: boolean
  setIsNavMenuOpen: Dispatch<SetStateAction<boolean>>
}

export default function Navbar ({ isNavMenuOpen, setIsNavMenuOpen, title }: NavbarProps): ReactElement {
  return (
    <header className={clsx(`bg-white opacity-95 border-b-slate-500 drop-shadow-sm p-4
                            sticky top-0 z-50 flex flex-wrap flex-row items-center gap-3`
    )}>
      <div className='mr-auto'>
        <Logo title={title} />
      </div>
      <nav className={clsx({
        'max-lg:py-2 max-lg:absolute top-full': isNavMenuOpen,
        'max-lg:hidden': !isNavMenuOpen
      })}>
        <NavLinks />
      </nav>
      <menu className="flex flex-row gap-2">
        <li className='flex items-center'>
          <button aria-label="Use Dark Mode"> <MoonIcon height={24} width={24} /></button>
        </li>
        <li className='lg:hidden flex items-center'>
          {isNavMenuOpen
            ? <button aria-label="Close Nav Menu" onClick={() => { setIsNavMenuOpen(false) }}>
              <XMarkIcon height={24} width={24} />
          </button>
            : <button aria-label="Open Nav Menu" onClick={() => { setIsNavMenuOpen(true) }}>
              <Bars3Icon height={24} width={24} />
            </button>
          }
        </li>
      </menu>
    </header>
  )
}
