'use client'
import { type ReactElement, useState } from 'react'
import { prompt } from './ui/fonts'
import Navbar from '@/app//ui/header/navbar'
import clsx from 'clsx'

export default function LayoutBody ({ children }: { children: React.ReactNode }): ReactElement {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)

  return (
    <body className={`${prompt.className} bg-slate-50`}>
      <Navbar
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
        title='PokeTeams'
      />
      <div className={clsx({ hidden: isNavMenuOpen })}>
        {children}
      </div>
    </body>
  )
}
