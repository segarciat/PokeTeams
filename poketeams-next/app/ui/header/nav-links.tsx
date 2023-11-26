import { HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactElement } from 'react'

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Pokesearch', href: '/pokesearch', icon: MagnifyingGlassIcon }
]

interface NavLinkProps {
  onLinkClick: () => void
}

export default function NavLinks (props: NavLinkProps): ReactElement {
  const pathname = usePathname()
  return <ul aria-label="Site navigation links" className='flex flex-col lg:flex-row gap-2'>
    {links.map(({ name, href, icon: LinkIcon }) => (
      <Link key={name} href={href} onClick={props.onLinkClick}
        className={clsx('flex flex-row items-center gap-1', {
          'text-primary': pathname === href
        })}
      >
        <LinkIcon width={24} height={24} />
        <p>{name}</p>
      </Link>
    ))}
  </ul>
}
