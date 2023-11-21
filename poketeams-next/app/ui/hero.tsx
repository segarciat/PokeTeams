import Image from 'next/image'
import { type ReactElement } from 'react'

export default function HeroSection (): ReactElement {
  return (
    <section className="flex flex-col p-10 text-center ring-1 ring-gray-400">
      <Image
        priority={true}
        width={96}
        height={96}
        src="/poketeams.png"
        alt="Temporary PokeTeams logo, by Sweet Farm."
        className="self-center mb-3"
      />
      <h1 className="text-4xl font-bold mb-3">
        Become a master like never before
      </h1>
      <p className="text-base mb-5">
        Search creatures, browse moves, peruse items, and assemble your own
        teams.
      </p>
      <div className="flex flex-row justify-center gap-4">
        <button className="py-2 px-5 rounded-full bg-primary text-white">
          Try It Out
        </button>
        <button className="py-2 px-5 rounded-full ring-1 ring-primary">
          Sign Up
        </button>
      </div>
    </section>
  )
}
