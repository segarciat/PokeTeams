import { type ReactElement } from 'react'
import Logo from '../logo'

export default function HeroSection (): ReactElement {
  return (
    <section aria-label="Headline" className="flex flex-col p-10 text-center ring-1 ring-gray-400">
      <Logo width={96} height={96} className="self-center mb-3 opacity-50" />
      <h1 className="text-4xl font-bold mb-3">
        Become a master like never before
      </h1>
      <p className="text-base mb-5">
        Search creatures, browse moves, peruse items, and assemble your own
        teams.
      </p>
      <menu className="flex flex-row justify-center gap-4">
        <li>
          <button className="py-2 px-5 rounded-full bg-primary-400 text-white">
            Try It Out
          </button>
        </li>
        <li>
          <button className="py-2 px-5 rounded-full ring-1 ring-slate-400">
            Sign Up
          </button>
        </li>
      </menu>
    </section>
  )
}
