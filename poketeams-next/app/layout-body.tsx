'use client'
import { type ReactElement, useState, useEffect } from 'react'
import { prompt } from './ui/fonts'
import Navbar from '@/app//ui/header/navbar'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

export default function LayoutBody ({ children }: { children: React.ReactNode }): ReactElement {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { // Close nav when route changes.
    setIsNavMenuOpen(false)
  }, [pathname])

  return (
    <body className={clsx(`${prompt.className} bg-slate-50`, { 'overflow-y-hidden': isNavMenuOpen })}>
      <Navbar
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
        title='PokeTeams'
      />
      <div className={clsx({ 'z-0 invisible': isNavMenuOpen })}>
        {children}
      </div>
    </body>
  )
}
