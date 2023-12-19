import type { Metadata } from 'next'
import '@/app/ui/globals.css'
// Reference: https://fontawesome.com/v5/docs/web/use-with/react#next-js
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false /* eslint-disable import/first */
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
    <html lang="en" className='bg:white dark:bg-primary-800'>
      <body className={`relative ${prompt.className} bg-slate-50 dark:bg-primary-900 dark:text-white`}>
        <Main title={PAGE_TITLE}>
          {children}
        </Main>
      </body>
    </html>
  )
}
