'use client'
import { type ReactElement, useState, useEffect } from 'react'
import { prompt } from './ui/fonts'
import Navbar from '@/app//ui/header/navbar'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

const DESKTOP_SCREEN_SIZE = 1024 // Default for TailwindCSS.

export default function LayoutBody ({ title, children }: { title: string, children: React.ReactNode }): ReactElement {
  const [isNavSidebarOpen, setIsNavSidebarOpen] = useState(false)
  const pathname = usePathname()
  const handleResize = useDebouncedCallback(() => {
    if (!isMobile()) {
      setIsNavSidebarOpen(false)
    }
  }, 100)

  function handleOpenNavMenu (): void {
    setIsNavSidebarOpen(isMobile())
  }

  function handleCloseNavMenu (): void {
    setIsNavSidebarOpen(false)
  }

  function isMobile (): boolean {
    return global.innerWidth < DESKTOP_SCREEN_SIZE
  }

  useEffect(() => { // Always close nav sidebar, if shown when route changes.
    console.log('pathname useeffect')
    setIsNavSidebarOpen(false)
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [pathname, handleResize])

  return (
    <body className={clsx(`${prompt.className} bg-slate-50`, { 'max-lg:overflow-y-hidden': isNavSidebarOpen })}>
      <Navbar isNavSidebarOpen={isNavSidebarOpen} onOpenNavSidebar={handleOpenNavMenu} onCloseNavSidebar={handleCloseNavMenu} title={title} />
      <main className={clsx({ 'max-lg:invisible': isNavSidebarOpen })}>
        {children}
      </main>
    </body>
  )
}
