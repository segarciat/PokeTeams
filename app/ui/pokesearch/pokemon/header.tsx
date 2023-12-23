import { type ReactElement } from 'react'
import Logo from '../../utils/logo'

export default function Header ({ id }: { id: number }): ReactElement {
  return (
    <header>
      <h3 className='flex items-center gap-1 text-base font-bold text-gray-300'>
        <Logo height={24} width={24} className='inline-block opacity-20' />
        Dex No.
      </h3>
      <p className='font-bold text-2xl text-gray-400'>{id.toString().padStart(4, '0')}</p>
    </header>
  )
}
