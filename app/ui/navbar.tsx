'use client'
import { type ReactElement, useState, useEffect } from 'react'
import { Bars3Icon, HomeIcon, InformationCircleIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'
import Logo from './logo'
import ThemeMenu from './theme-menu'
import NavLinks, { type NavLinkContent } from './nav-links'
import { useDebouncedCallback } from 'use-debounce'

export const MOBILE_THRESHOLD = 1024
const links: NavLinkContent[] = [
  { name: 'Home', href: '/', icon: HomeIcon as NavLinkContent['icon'] },
  { name: 'About', href: '/about', icon: InformationCircleIcon as NavLinkContent['icon'] },
  { name: 'Pokesearch', href: '/pokesearch', icon: MagnifyingGlassIcon as NavLinkContent['icon'] }
]

export interface NavbarProps {
  title: string
}

export default function Navbar ({ title }: NavbarProps): ReactElement {
  const [showSideMenu, setShowSideMenu] = useState(false)

  function handleToggleSideMenu (show: boolean): void {
    const hideScrollBarClass = 'max-lg:overflow-y-hidden'
    setShowSideMenu(show)
    if (show) {
      document.body.classList.add(hideScrollBarClass)
    } else {
      document.body.classList.remove(hideScrollBarClass)
    }
  }

  function handleShowSideMenu (): void {
    handleToggleSideMenu(true)
  }

  function handleHideSideMenu (): void {
    handleToggleSideMenu(false)
  }

  const handleScreenResize = useDebouncedCallback(() => {
    const isDesktopSize = global.innerWidth >= MOBILE_THRESHOLD
    if (isDesktopSize) {
      handleToggleSideMenu(false)
    }
  }, 0)

  useEffect(() => {
    global.addEventListener('resize', handleScreenResize)
    return () => {
      global.removeEventListener('resize', handleScreenResize)
    }
  }, [handleScreenResize])

  return (
    <header className='flex p-4 bg-white border-b border-b-slate-300 shadow-sm dark:bg-primary-800 sticky top-0 z-30'>
      <div className={clsx('flex items-center justify-between w-full')}>
        <Link href='/' className='flex flex-row items-center gap-2 mr-auto'>
          <Logo height={32} width={32} className='self-center' />
          <h1 className="font-bold">{title}</h1>
        </Link>
        {!showSideMenu && <SideNavOpener onClick={handleShowSideMenu} />}
      </div>
      <Glass showGlass={showSideMenu} onClickGlass={handleHideSideMenu}/>
      <div className={clsx('flex flex-col gap-2 fixed top-4 right-4 z-50 p-4 bg-white dark:bg-primary-800 border-2 rounded-md lg:relative lg:top-0 lg:right-0 lg:flex-row lg:items-center lg:p-0 lg:border-none', {
        'max-lg:hidden': !showSideMenu
      })}>
        {showSideMenu && (
          <button type='button' aria-label='close nav sidebar' onClick={handleHideSideMenu} className='absolute right-2 top-4 lg:hidden'>
            <XMarkIcon height={20} width={20} />
          </button>
        )}
        <NavLinks links={links} onClick={handleHideSideMenu} />
        <NavMenuDivider />
        <ThemeMenu />
      </div>
    </header>
  )
}

function SideNavOpener ({ onClick }: { onClick: () => void }): ReactElement {
  return (
    <div className='lg:hidden'>
      <button type='button' aria-label='open nav sidebar' onClick={onClick} className='flex items-center'>
        <Bars3Icon height={24} width={24} />
      </button>
    </div>
  )
}

function Glass ({ onClickGlass, showGlass }: { showGlass: boolean, onClickGlass: () => void }): ReactElement {
  return (
    <div onClick={onClickGlass} className={clsx('fixed top-0 right-0 h-screen w-screen hidden', { 'max-lg:block backdrop-blur-sm': showGlass })} />
  )
}

function NavMenuDivider (): ReactElement {
  return <span className='w-full h-full border border-black opacity-5' />
}
