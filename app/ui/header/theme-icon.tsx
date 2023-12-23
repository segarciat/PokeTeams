import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { type ReactElement } from 'react'

export const THEMES = ['light', 'dark', 'system'] as const
export type Theme = typeof THEMES[number]

export default function ThemeIcon ({ theme, className }: { theme: Theme, className: string }): ReactElement {
  switch (theme) {
    case 'dark': {
      return <MoonIcon className={className} />
    }
    case 'light': {
      return <SunIcon className={className} />
    }
    case 'system': {
      return <FontAwesomeIcon icon={faCircleHalfStroke} className={className} />
    }
  }
}
