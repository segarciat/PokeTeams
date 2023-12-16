'use client'
import React, { useState, type ReactElement, useEffect } from 'react'
import clsx from 'clsx'
import Navbar from './navbar'
import { useDebouncedCallback } from 'use-debounce'

const MOBILE_THRESHOLD = 1024

export default function Main ({ children, title }: { children: React.ReactNode, title: string }): ReactElement {
  const [showSideMenu, setShowSideMenu] = useState(false)

  const handleScreenResize = useDebouncedCallback(() => {
    const isDesktopSize = global.innerWidth >= MOBILE_THRESHOLD
    if (isDesktopSize) {
      setShowSideMenu(false)
    }
  }, 200)

  // When side menu is shown, also change the overflow.
  useEffect(() => {
    if (showSideMenu) {
      document.body.classList.add('max-lg:overflow-y-hidden')
    } else {
      document.body.classList.remove('max-lg:overflow-y-hidden')
    }
  }, [showSideMenu])

  useEffect(() => {
    ('single time main useEffect')
    global.addEventListener('resize', handleScreenResize)
    return () => {
      global.removeEventListener('resize', handleScreenResize)
    }
  }, [handleScreenResize])

  return <>
    <Navbar title={title} showSideMenu={showSideMenu} setShowSideMenu={setShowSideMenu}/>
    <main className={clsx({ 'max-lg:invisible': showSideMenu })}>
      {children}
    </main>
  </>
}
