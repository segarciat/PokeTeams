'use client'
import React, { type ReactElement, useEffect, useState } from 'react'
import Navbar from './navbar'
import clsx from 'clsx'
import { useDebouncedCallback } from 'use-debounce'

const MOBILE_THRESHOLD = 1024

export default function Main ({ children, title }: { children: React.ReactNode, title: string }): ReactElement {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)
  toggleScrolling(isSideNavOpen)

  const handleScreenResize = useDebouncedCallback(() => {
    const isDesktopSize = global.innerWidth >= MOBILE_THRESHOLD
    if (isDesktopSize) {
      setIsSideNavOpen(false)
    }
  }, 200)

  useEffect(() => {
    global.addEventListener('resize', handleScreenResize)
    return () => { global.removeEventListener('resize', handleScreenResize) }
  })

  return <>
    <Navbar title={title} isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen} />
    <main className={clsx({ 'max-lg:invisible': isSideNavOpen })}>
      {children}
    </main>
  </>
}

function toggleScrolling (isSideNavOpen: boolean): void {
  if (typeof window !== 'undefined') {
    if (isSideNavOpen) {
      document.body.classList.add('max-lg:overflow-y-hidden')
    } else {
      document.body.classList.remove('max-lg:overflow-y-hidden')
    }
  }
}
