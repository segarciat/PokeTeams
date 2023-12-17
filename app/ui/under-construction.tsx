import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { type ReactElement } from 'react'

export default function UnderConstruction (): ReactElement {
  return (
    <section aria-label='section under construction' className='p-4'>
      <div className='flex flex-col items-center gap-2'>
        <Image
          src="/Construction-truck-pana.svg"
          alt="No results image"
          height={450}
          width={450}
        />
        <a href="https://storyset.com/work" target="_blank"
          rel="noreferrer noopener"
          className="text-blue-400 text-xs">Illustration by Storyset
        </a>
        <h3 className='text-center text-2xl font-semibold'>Page under construction</h3>
        <p className='pb-4 text-center'> In the meantime, enjoy the rest of the site</p>
        <Link href='/' className='text-white bg-primary px-8 py-4 rounded-full'>
          <ArrowUturnLeftIcon height={20} width={20} className='inline-block' /> Back to PokeTeams
        </Link>
      </div>
    </section>
  )
}
