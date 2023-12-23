import { type ReactElement } from 'react'

export function PokeCardSkeleton (): ReactElement {
  return <article className='bg-white dark:bg-primary-900 ring-1 ring-slate-200 rounded-2xl w-[280px] p-3 flex flex-col flex-shrink gap-2 relative '>
    <header className='flex flex-row gap-2'>
      <span className="inline-block h-5 w-5 rounded-full bg-gray-200 dark:bg-primary-800" />
      <span className="inline-block h-5 w-10 rounded-md bg-gray-200 dark:bg-primary-800" />
    </header>
    <div className='inline-block h-5 w-12 rounded-md bg-gray-200 dark:bg-primary-800'/>
    <div className='h-32 w-32 bg-gray-200 dark:bg-primary-800 rounded-md self-center' />
    <hr/>
    <div className='h-5 w-10 bg-gray-200 dark:bg-primary-800 rounded-md' />
    <div className='h-5 w-16 bg-gray-200 dark:bg-primary-800 rounded-md self-center' />
    <hr />
    <div className='h-5 w-10 bg-gray-200 dark:bg-primary-800 rounded-md' />
    <div className='h-5 w-16 bg-gray-200 dark:bg-primary-800 rounded-md self-center' />
    <hr/>
    <div className='h-5 w-24 bg-gray-200 dark:bg-primary-800 rounded-md self-center' />
  </article>
}

export function SearchResultsSkeleton (): ReactElement {
  return <div className='flex flex-col items-center gap-4 py-4'>
    <PokeCardSkeleton />
    <PokeCardSkeleton />
    <PokeCardSkeleton />
    <PokeCardSkeleton />
  </div>
}

export default function PokeSearchSkeleton (): ReactElement {
  return (
    <div className='flex flex-col gap-2 p-4'>
      <div className='h-9 w-32 rounded-md bg-gray-200 dark:bg-primary-800' />
      <div className='h-6 w-full rounded-md bg-gray-200 dark:bg-primary-800' />
      <SearchResultsSkeleton />
    </div>
  )
}
