import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { type ReactElement, useRef, useState, useEffect } from 'react'
import { capitalize } from '../lib/utils'

type Theme = 'light' | 'dark' | 'system'
export const LS_THEME_KEY = 'theme'

const themes = [
  { icon: SunIcon, size: 24, theme: 'light' as Theme },
  { icon: MoonIcon, size: 24, theme: 'dark' as Theme },
  { icon: ComputerDesktopIcon, size: 24, theme: 'system' as Theme }
]

export default function ThemeMenuItem (): ReactElement {
  const menuRef = useRef<HTMLButtonElement>(null)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>('system') // TODO: set initial theme correctly.

  const ButtonIcon = themes.find(t => t.theme === currentTheme)?.icon

  function handleThemeMenuClick (): void {
    setShowThemeMenu(isOpen => !isOpen)
  }

  function handleChangeTheme (theme: Theme): void {
    if (theme === 'light') {
      localStorage.setItem(LS_THEME_KEY, 'light')
    } else if (theme === 'dark') {
      localStorage.setItem(LS_THEME_KEY, 'dark')
    } else {
      localStorage.removeItem(LS_THEME_KEY)
    }
    applyTheme()
    setShowThemeMenu(false)
    setCurrentTheme(theme)
  }

  function applyTheme (): void {
    if (localStorage?.getItem?.(LS_THEME_KEY) === 'dark' ||
      (!(LS_THEME_KEY in localStorage) && global?.matchMedia?.('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => { // Apply theme initially
    setCurrentTheme(localStorage.getItem(LS_THEME_KEY) as Theme ?? 'system')
    applyTheme()
  }, [])

  useEffect(() => {
    function handleDocumentClick (e: MouseEvent): void {
      if (!(menuRef?.current?.contains(e.target as Node) ?? false)) { // Click outside theme menu.
        setShowThemeMenu(false)
      }
    }
    global.addEventListener('click', handleDocumentClick)
    return () => {
      global.removeEventListener('click', handleDocumentClick)
    }
  }, [setShowThemeMenu, menuRef])

  return (
    <li className='flex items-center relative px-2 max-lg:border-r lg:border-l dark:border-gray-400'>
      <button ref={menuRef} onClick={handleThemeMenuClick} aria-label="Change theme">
        {ButtonIcon !== undefined && <ButtonIcon className='text-primary-300' height={24} width={24} />}
      </button>
      <ul aria-label='theme menu' className={clsx('bg-slate-200 dark:bg-gray-800 rounded-md p-4 flex flex-col gap-2 absolute right-0 top-12 min-w-max', {
        hidden: !showThemeMenu
      })}>
        {themes.map(({ icon: Icon, size, theme }) => (
          <li key={theme} className={clsx('flex flex-row items-center', { 'text-primary-300': currentTheme === theme })}>
            <button aria-label={`set ${theme} theme`} onClick={e => { handleChangeTheme(theme) }}>
              <Icon height={size} width={size} className='inline-block' /> {capitalize(theme)}
            </button>
          </li>
        ))}
      </ul>
    </li>
  )
}
