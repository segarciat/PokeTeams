import type { Metadata } from 'next'
import '@/app/ui/globals.css'
import LayoutBody from './layout-body'
import React, { type ReactElement } from 'react'

const PAGE_TITLE = 'PokeTeams'
export const metadata: Metadata = {
  title: {
    template: `%s | ${PAGE_TITLE}`,
    default: `${PAGE_TITLE}`
  },
  description: 'Pokemon-themed hobby project powered by PokeAPI.'
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout ({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <LayoutBody title={PAGE_TITLE}>{children}</LayoutBody>
    </html>
  )
}
