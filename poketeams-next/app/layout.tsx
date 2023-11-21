import type { Metadata } from 'next'
import '@/app/ui/globals.css'
import Providers from './providers'
import { type ReactElement } from 'react'

export const metadata: Metadata = {
  title: 'PokeTeams',
  description: 'Pokemon-themed hobby project powered by PokeAPI.'
}

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}): ReactElement {
  return (
    <html lang="en">
      <Providers>{children}</Providers>
    </html>
  )
}
