import clsx from 'clsx'
import { type ReactElement, useRef, useState, type MouseEvent, useEffect } from 'react'
import { capitalize } from '../lib/utils'
import ThemeIcon, { THEMES, type Theme } from './theme-icon'
import Modal from './utils/modal'

export const LS_THEME_KEY = 'theme'

export default function ThemeMenu (): ReactElement {
  const menuRef = useRef(null)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>('system')

  function handleThemeMenuClick (e: MouseEvent<HTMLButtonElement>): void {
    // e.stopPropagation()
    e.preventDefault()
    setShowThemeMenu(isOpen => !isOpen)
  }

  function handleChangeTheme (theme: Theme): void {
    if (theme === 'system') {
      localStorage.removeItem(LS_THEME_KEY)
    } else {
      localStorage.setItem(LS_THEME_KEY, theme)
    }

    if (theme === 'dark' || (theme === 'system' && global?.matchMedia?.('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    setCurrentTheme(theme)
    setShowThemeMenu(false)
  }

  useEffect(() => { // Apply theme initially
    let savedTheme = localStorage?.getItem?.(LS_THEME_KEY)
    if (!THEMES.includes(savedTheme as Theme)) {
      savedTheme = 'system'
    }
    handleChangeTheme(savedTheme as Theme)
  }, [])

  return (
    <div ref={menuRef} className='relative'>
      <button onClick={handleThemeMenuClick} type='button' aria-label="Change theme"
        className='text-primary-300 z-10 flex items-center gap-1'>
          <ThemeIcon theme={currentTheme} className='w-5 h-5 text-md inline-block'/>
          Theme
      </button>
      {showThemeMenu && (
        <Modal containerRef={menuRef} onClose={setShowThemeMenu.bind(null, false)}>
          <div className='absolute top-12 max-lg:-left-2 lg:-right-2'>
            <ThemeItems currentTheme={currentTheme} onThemeSelection={handleChangeTheme} />
          </div>
        </Modal>
      )}
    </div>
  )
}

interface ThemeItemsProps {
  currentTheme: Theme
  onThemeSelection: (theme: Theme) => void
}

function ThemeItems ({ currentTheme, onThemeSelection }: ThemeItemsProps): ReactElement {
  function handleThemeSelection (theme: Theme): void {
    onThemeSelection(theme)
  }

  return (
    <ul aria-label='theme menu' className={'bg-slate-200 dark:bg-gray-800 rounded-md p-4 flex flex-col gap-2 min-w-max'}>
      {THEMES.map((theme) => (
        <li key={theme} >
          <button aria-label={`set ${theme} theme`} onClick={handleThemeSelection.bind(null, theme)}
            className='flex justify-between items-center gap-1'>
              <ThemeIcon theme={theme} className={clsx('w-5 h-5 text-md', { 'text-primary-300': currentTheme === theme })} />
              {capitalize(theme)}
          </button>
        </li>
      ))}
    </ul>
  )
}
