import Image from 'next/image'
import { type ReactElement } from 'react'

export default function NoResults (): ReactElement {
  return (
    <>
      <h3 className='text-center text-xl font-semibold'>Woops, no results.</h3>
      <p className='pb-4 text-center'> Please try again.</p>
      <Image
        src="/Empty-pana.svg"
        alt="No results image"
        height={300}
        width={300}
      />
      <a href="https://storyset.com/work" target="_blank"
        rel="noreferrer noopener"
        className="text-blue-400 text-xs">Illustration by Storyset
      </a>
    </>
  )
}
