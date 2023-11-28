import Image from 'next/image'
import { type ReactElement } from 'react'

export default function Logo ({ title }: { title: string }): ReactElement {
  return <div className="flex flex-row items-center gap-2">
    <Image src="/poketeams.png" width={32} height={32} alt="Temporary PokeTeams logo, by Sweet Farm."
      className="self-center"
    />
    <h1 className="font-bold">{title}</h1>
  </div>
}
