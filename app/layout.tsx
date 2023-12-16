import type { Metadata } from 'next'
import '@/app/ui/globals.css'
import React, { type ReactElement } from 'react'
import { prompt } from './ui/fonts'
import Main from './ui/main'

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

// const MainNoSSR = dynamic(async () => await import('./ui/main'), { ssr: false })

export default function RootLayout ({ children }: RootLayoutProps): ReactElement {
  return (
    <html lang="en">
      <body className={`${prompt.className} bg-slate-50 dark:bg-primary-900 dark:text-white`}>
        <Main title={PAGE_TITLE}>
          {children}
        </Main>
      </body>
    </html>
  )
}
