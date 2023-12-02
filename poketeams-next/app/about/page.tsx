import { type ReactElement } from 'react'

export default function About (): ReactElement {
  return (
    <div className='p-4'>
      <h2 className='font-bold text-4xl'>About</h2>
      <p className='bg-white p-4 rounded-md'>
        PokeTeams is a hobby project. It uses
        the <a
          href='https://pokeapi.co/'
          target="_blank"
          rel="noreferrer noopener"
          className="text-blue-400"
        >
          PokeAPI
        </a> to
         provide you with Pokemon information.
      </p>
    </div>
  )
}
