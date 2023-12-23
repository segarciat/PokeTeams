import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactElement } from 'react'

export default function NotFound (): ReactElement {
  return (
    <div className='p-4 flex flex-col items-center gap-2'>
      <Image
        src="/404-not-found.svg"
        alt="Not found image"
        height={300}
        width={300}
      />
      <a href="https://storyset.com/internet" target="_blank"
        rel="noreferrer noopener"
        className="text-blue-400 text-xs">Illustration by Storyset
      </a>
      <h3 className='text-center text-2xl font-semibold'>Oh no, you have lost your way!</h3>
      <p className='pb-4 text-center'> Where did it go wrong? Find a Pokemon to help you return to safety</p>
      <Link href='/' className='text-white bg-primary px-8 py-4 rounded-full'>
        <ArrowUturnLeftIcon height={20} width={20} className='inline-block'/> Back to PokeTeams
      </Link>
    </div>
  )
}
