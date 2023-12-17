import { capitalize } from '@/app/lib/utils'
import UnderConstruction from '@/app/ui/under-construction'
import { type ReactElement } from 'react'

export interface PageProps {
  params: { name: string }
}

export default function Page ({ params }: PageProps): ReactElement {
  const { name } = params
  return (
    <div className='p-4'>
      <h2 className='text-bold text-4xl'>{capitalize(name)}</h2>
      <UnderConstruction />
    </div>
  )
}
