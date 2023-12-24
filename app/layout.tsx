import type { Metadata } from 'next'
import '@/app/ui/globals.css'
// Reference: https://fontawesome.com/v5/docs/web/use-with/react#next-js
// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css'
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false /* eslint-disable import/first */
import 'react-toastify/dist/ReactToastify.css'
import React, { type ReactElement } from 'react'
import { prompt } from './ui/fonts'
import { ToastContainer } from 'react-toastify'
import Navbar from './ui/header/navbar'
import ScrollToTopBtn from './ui/utils/scroll-top-btn'

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
      <body className={`relative ${prompt.className}  dark:bg-primary-900 dark:text-white`}>
        <ToastContainer position='top-right' autoClose={2000} draggable={false} hideProgressBar={true}/>
        <Navbar title={PAGE_TITLE} />
        <main>
          {children}
          <ScrollToTopBtn />
        </main>
      </body>
    </html>
  )
}
