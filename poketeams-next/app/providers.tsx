'use client'
import { type ReactElement, useState } from 'react'
import Navbar from './ui/navbar'
import { prompt } from './ui/fonts'
import clsx from 'clsx'

export default function Providers ({ children }: { children: React.ReactNode }): ReactElement {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false)
  return (
    <body
      className={clsx(`${prompt.className}`, {
        'overflow-hidden': isNavMenuOpen // Disable scrolling.
      })}
    >
      <Navbar
        isNavMenuOpen={isNavMenuOpen}
        setIsNavMenuOpen={setIsNavMenuOpen}
      />
      <div>{children}</div>
    </body>
  )
}
