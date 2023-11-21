import HeroSection from './ui/hero'
import FeaturesSection from './ui/features'
import { type ReactElement } from 'react'

export default function Home (): ReactElement {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
