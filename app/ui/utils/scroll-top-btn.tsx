'use client'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useEffect, type ReactElement, useState, useRef } from 'react'

export const SHOW_BTN_DURATION = 3000

export default function ScrollToTopBtn (): ReactElement | null {
  const buttonShowTimeout = useRef<number | undefined>()
  const scrollPosition = useRef(0)
  const [show, setShow] = useState(false)

  function handleClick (): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    function handleScroll (): void {
      window?.clearTimeout(buttonShowTimeout.current)
      const newPosition = global.scrollY
      if (newPosition !== 0 && newPosition < scrollPosition.current) {
        setShow(true)
        buttonShowTimeout.current = window?.setTimeout(() => {
          setShow(false)
        }, SHOW_BTN_DURATION)
      } else {
        setShow(false)
      }
      scrollPosition.current = newPosition
    }
    global.addEventListener('scroll', handleScroll)
    return () => {
      global.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    !show
      ? null
      : (
        <button type='button' aria-label='scroll top' onClick={handleClick} className='fixed right-2 bottom-8 rounded-full p-2 text-gray-200 bg-primary-200 animate-bounce'>
          <ArrowUpIcon height={24} width={24} />
        </button>
        )
  )
}
