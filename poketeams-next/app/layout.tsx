import type { Metadata } from 'next'
import '@/app/ui/globals.css'
import LayoutBody from './layout-body'
import React, { type ReactElement } from 'react'

export const metadata: Metadata = {
  title: 'PokeTeams',
  description: 'Pokemon-themed hobby project powered by PokeAPI.'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout ({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <LayoutBody>{children}</LayoutBody>
    </html>
  )
}
