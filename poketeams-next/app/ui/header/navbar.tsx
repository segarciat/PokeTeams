'use client'
import { type ReactElement } from 'react'
import Logo from './logo'
import NavLinks from './nav-links'
import NavActions from './nav-actions'

export interface NavbarProps {
  title: string
  isNavSidebarOpen: boolean
  onOpenNavSidebar: () => void
  onCloseNavSidebar: () => void
}

export default function Navbar (props: NavbarProps): ReactElement {
  return (
    <header className={`bg-white opacity-95 border-b-slate-500 drop-shadow-sm p-4
      sticky top-0 flex flex-wrap flex-row items-center gap-3`
    }>
      <div className='mr-auto'>
        <Logo title={props.title} />
      </div>
      <nav aria-label="site navigation links" className={props.isNavSidebarOpen ? 'max-lg:py-2 max-lg:absolute top-full' : 'max-lg:hidden'}>
        <NavLinks />
      </nav>
      <NavActions isNavMenuOpen={props.isNavSidebarOpen} onOpenNavMenu={props.onOpenNavSidebar} onCloseNavMenu={props.onCloseNavSidebar}/>
    </header>
  )
}
