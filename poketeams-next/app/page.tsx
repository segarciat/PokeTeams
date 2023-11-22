import HeroSection from './ui/home/hero'
import FeaturesSection from './ui/home/features'
import { type ReactElement } from 'react'

export default function Home (): ReactElement {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
    </main>
  )
}
