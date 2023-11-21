'use client'

import Image from 'next/image'
import {
  Bars3Icon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import clsx from 'clsx'
import { type ReactElement, type Dispatch, type SetStateAction } from 'react'

export interface NavbarProps {
  isNavMenuOpen: boolean
  setIsNavMenuOpen: Dispatch<SetStateAction<boolean>>
}
export default function Navbar ({
  isNavMenuOpen,
  setIsNavMenuOpen
}: NavbarProps): ReactElement {
  function handleCloseNav (): void {
    setIsNavMenuOpen(false)
  }

  return (
    <>
      <nav
        className={clsx(
          'flex flex-row items-center place-content-between bg-primary p-4'
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <Image
            priority={true}
            width={32}
            height={32}
            src="/poketeams.png"
            alt="Temporary PokeTeams logo, by Sweet Farm."
            className="self-center"
          />
          <p className="font-bold">PokeTeams</p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <button>
            <MoonIcon height={24} width={24} />
          </button>
          <button onClick={() => { setIsNavMenuOpen(true) }}>
            <Bars3Icon height={28} width={28} />
          </button>
        </div>
        {isNavMenuOpen && (
          <div className="absolute h-screen w-screen top-0 right-0 overflow-hidden">
            <div
              onClick={handleCloseNav}
              className="absolute h-screen w-screen top-0 right-0 backdrop-blur-sm"
            />
            <Menu onMenuButtonClick={handleCloseNav} />
          </div>
        )}
      </nav>
    </>
  )
}

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Pokesearch', href: '/pokesearch', icon: MagnifyingGlassIcon }
]
interface MenuProps {
  onMenuButtonClick: () => void
}
function Menu ({ onMenuButtonClick }: MenuProps): ReactElement {
  const pathname = usePathname()
  return (
    <div
      className={clsx(
        `absolute right-0 top-0 flex flex-col gap-3 h-screen w-9/12 border-2 bg-slate-100
        p-3 rounded-l-md drop-shadow-md z-50 animate-slideIn`
      )}
    >
      <button className="self-end" onClick={onMenuButtonClick}>
        <XMarkIcon height={28} width={28} />
      </button>
      {links.map(({ name, href, icon: LinkIcon }) => {
        return (
          <Link
            onClick={onMenuButtonClick}
            key={name}
            href={href}
            className={clsx('flex flex-row items-center gap-1', {
              'text-primary': pathname === href
            })}
          >
            <LinkIcon width={20} height={20} />
            <p>{name}</p>
          </Link>
        )
      })}
    </div>
  )
}
