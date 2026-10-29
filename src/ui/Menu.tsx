import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import styled from 'styled-components'
import { IconButton } from './IconButton.tsx'
import { KebabIcon } from './icons.tsx'
import { useDismiss } from './useDismiss.ts'

interface MenuItem {
  label: string
  icon?: ReactNode
  tone?: 'danger'
  onSelect: () => void
}

interface MenuProps {
  items: MenuItem[]
  className?: string
}

export const Menu = ({ items, className }: MenuProps) => {
  const [position, setPosition] = useState<{
    top: number
    right: number
  } | null>(null)
  const isOpen = position !== null
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = () => setPosition(null)
  useDismiss(isOpen, rootRef, triggerRef, close)

  const open = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) {
      return
    }
    setPosition({
      top: rect.bottom + 4,
      right: document.documentElement.clientWidth - rect.right,
    })
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()

    const handleScrollOrResize = () => setPosition(null)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [isOpen])

  const select = (item: MenuItem) => {
    close()
    triggerRef.current?.focus()
    item.onSelect()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const menuItems = [
      ...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    ]
    const current = menuItems.findIndex(
      (item) => item === document.activeElement,
    )
    const last = menuItems.length - 1
    const next = {
      ArrowDown: current === last ? 0 : current + 1,
      ArrowUp: current <= 0 ? last : current - 1,
      Home: 0,
      End: last,
    }[event.key]

    if (next !== undefined) {
      event.preventDefault()
      menuItems[next]?.focus()
    } else if (event.key === 'Tab') {
      close()
    }
  }

  return (
    <Root ref={rootRef} className={className}>
      <IconButton ref={triggerRef} onClick={() => (isOpen ? close() : open())}>
        <KebabIcon />
      </IconButton>
      {position && (
        <Popup
          ref={menuRef}
          role="menu"
          style={{ top: position.top, right: position.right }}
          onKeyDown={handleKeyDown}
        >
          {items.map((item) => (
            <Item
              key={item.label}
              type="button"
              role="menuitem"
              tabIndex={-1}
              $tone={item.tone}
              onClick={() => select(item)}
            >
              {item.icon}
              {item.label}
            </Item>
          ))}
        </Popup>
      )}
    </Root>
  )
}

const Root = styled.div`
  display: flex;
`

const Popup = styled.div`
  position: fixed;
  z-index: 30;
  display: flex;
  flex-direction: column;
  min-width: 40rem;
  padding: ${({ theme }) => theme.space.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const Item = styled.button<{ $tone?: 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  height: 8rem;
  padding: 0 ${({ theme }) => theme.space.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: none;
  font: inherit;
  color: ${({ theme, $tone }) =>
    $tone === 'danger' ? theme.colors.danger : theme.colors.text};
  text-align: left;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    outline: none;
    background: ${({ theme }) => theme.colors.rowHover};
  }
`
