import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactElement } from 'react'

export interface NavLinkContent {
  name: string
  href: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

export interface NavLinksProps {
  onClick: () => void
  links: NavLinkContent[]
}

export default function NavLinks ({ links, onClick }: NavLinksProps): ReactElement {
  const pathname = usePathname()
  return (
    <nav aria-label="Site navigation links">
      <ul className='flex flex-col lg:flex-row gap-2'>
        {links.map((content) => (
          <NavItem key={content.name} content={content} onClick={onClick} isCurrent={pathname === content.href} />
        ))}
      </ul>
    </nav>
  )
}

interface NavItemProps {
  content: NavLinkContent
  isCurrent: boolean
  onClick: () => void
}

function NavItem ({ content: { name, href, icon: Icon }, isCurrent, onClick }: NavItemProps): ReactElement {
  return (
    <li>
      <Link href={href} onClick={onClick} aria-current={isCurrent ? 'page' : false}
        className={clsx('flex items-center gap-1', { 'text-primary-300': isCurrent })}
      >
        {Icon !== undefined && <Icon width={20} height={20} />}
        <span>{name}</span>
      </Link>
    </li>
  )
}
