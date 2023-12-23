import { useEffect, type ReactElement, type MutableRefObject } from 'react'
import React from 'react'

export interface ModalProps {
  children: React.ReactNode
  containerRef: MutableRefObject<HTMLElement | null>
  onClose: () => void
}

export default function Modal ({ children, containerRef, onClose }: ModalProps): ReactElement {
  useEffect(() => {
    function handleDocumentClick (e: MouseEvent): void {
      if (!e.defaultPrevented && !((containerRef)?.current?.contains(e.target as Node) ?? false)) {
        onClose()
      }
    }
    global.addEventListener('click', handleDocumentClick)
    return () => {
      global.removeEventListener('click', handleDocumentClick)
    }
  }, [containerRef, onClose])
  return <>{children}</>
}
