'use client'
import { useEffect, type ReactElement } from 'react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, HomeIcon, InformationCircleIcon, MagnifyingGlassIcon, MoonIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import clsx from 'clsx'
import Logo from './logo'

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'About', href: '/about', icon: InformationCircleIcon },
  { name: 'Pokesearch', href: '/pokesearch', icon: MagnifyingGlassIcon }
]

export interface NavbarProps {
  title: string
  isSideNavOpen: boolean
  setIsSideNavOpen: (value: React.SetStateAction<boolean>) => void
}

export default function Navbar ({ title, isSideNavOpen, setIsSideNavOpen }: NavbarProps): ReactElement {
  // Menu is always rendered. However, it's hidden when the navbar is not open.
  const pathname = usePathname()

  function handleTogglerClick (): void {
    setIsSideNavOpen(isOpen => !isOpen)
  }
  useEffect(() => {
    setIsSideNavOpen(false)
  }, [pathname, setIsSideNavOpen])

  return (
    <header className={`bg-white opacity-95 border-b-slate-600 dark:bg-primary-800 drop-shadow-sm p-4
      sticky top-0 z-50 flex flex-wrap flex-row items-center gap-3`
    }>
      <div aria-label="logo" className='mr-auto'>
        <Link href='/' className='flex flex-row items-center gap-2'>
          <Logo height={32} width={32} className='self-center'/>
          <h1 className="font-bold">{title}</h1>
        </Link>
      </div>
      <nav aria-label="Site navigation links" className={isSideNavOpen ? 'max-lg:py-2 max-lg:absolute top-full' : 'max-lg:hidden'}>
        <ul className='flex flex-col lg:flex-row gap-2'>
          {links.map(({ name, href, icon: LinkIcon }) => {
            const isCurrent = pathname === href
            return (
              <Link key={name} href={href} aria-current={isCurrent ? 'page' : false}
                className={clsx('flex flex-row items-center gap-1', { 'text-primary-300': isCurrent })}
              >
                <LinkIcon width={24} height={24} />
                <span>{name}</span>
              </Link>
            )
          })}
        </ul>
      </nav>
      <menu aria-label="Site actions" className="flex flex-row gap-2">
        <li className='flex items-center'>
          <button aria-label="Use Dark Mode"> <MoonIcon height={24} width={24} /></button>
        </li>
        <li className='lg:hidden flex items-center'>
          {isSideNavOpen
            ? <button aria-label='close nav sidebar' onClick={handleTogglerClick}>
              <XMarkIcon height={24} width={24} />
          </button>
            : <button aria-label='open nav sidebar' onClick={handleTogglerClick}>
              <Bars3Icon height={24} width={24} />
          </button>
          }
        </li>
      </menu>
    </header>
  )
}
