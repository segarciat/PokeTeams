import HeroSection from './ui/home/hero'
import Features from './ui/home/features'
import { type ReactElement } from 'react'

export default function Home (): ReactElement {
  return (
    <>
      <HeroSection />
      <Features />
    </>
  )
}
