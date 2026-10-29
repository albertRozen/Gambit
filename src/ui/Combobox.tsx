import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import styled from 'styled-components'
import { matchesQuery } from '../utils/matchesQuery.ts'
import { SearchInput } from './SearchInput.tsx'
import { useDismiss } from './useDismiss.ts'

interface ComboboxOption {
  value: string
  label: string
  description?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  onSelect: (value: string) => void
}

interface PopupPosition {
  left: number
  width: number
  top?: number
  bottom?: number
  maxHeight: number
}

const MAX_POPUP_HEIGHT = 240
const MIN_POPUP_HEIGHT = 96
const MIN_SPACE_BELOW = 160
const GAP = 4

const getPopupPosition = (input: HTMLElement): PopupPosition => {
  const rect = input.getBoundingClientRect()
  const spaceBelow = window.innerHeight - rect.bottom - GAP * 2
  const spaceAbove = rect.top - GAP * 2
  const openAbove = spaceBelow < MIN_SPACE_BELOW && spaceAbove > spaceBelow

  return {
    left: rect.left,
    width: rect.width,
    ...(openAbove
      ? { bottom: window.innerHeight - rect.top + GAP }
      : { top: rect.bottom + GAP }),
    maxHeight: Math.max(
      MIN_POPUP_HEIGHT,
      Math.min(MAX_POPUP_HEIGHT, openAbove ? spaceAbove : spaceBelow),
    ),
  }
}

export const Combobox = ({
  options,
  placeholder,
  emptyMessage = 'No matches',
  onSelect,
}: ComboboxProps) => {
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState<PopupPosition | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const isOpen = position !== null

  const matches = options.filter((option) =>
    matchesQuery(`${option.label} ${option.description ?? ''}`, query),
  )

  const open = () => {
    if (inputRef.current) {
      setPosition(getPopupPosition(inputRef.current))
    }
  }
  const close = () => setPosition(null)
  useDismiss(isOpen, rootRef, inputRef, close)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const reposition = (event: Event) => {
      if (
        event.target instanceof Node &&
        listRef.current?.contains(event.target)
      ) {
        return
      }
      if (inputRef.current) {
        setPosition(getPopupPosition(inputRef.current))
      }
    }

    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [isOpen])

  useEffect(() => {
    const list = listRef.current
    const option = list?.children[activeIndex]
    if (!list || !(option instanceof HTMLElement)) {
      return
    }

    if (option.offsetTop < list.scrollTop) {
      list.scrollTop = option.offsetTop
    } else if (
      option.offsetTop + option.offsetHeight >
      list.scrollTop + list.clientHeight
    ) {
      list.scrollTop =
        option.offsetTop + option.offsetHeight - list.clientHeight
    }
  }, [activeIndex])

  const select = (option: ComboboxOption) => {
    onSelect(option.value)
    setQuery('')
    setActiveIndex(0)
    close()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        open()
        return
      }
      if (matches.length === 0) {
        return
      }
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex(
        (index) => (index + step + matches.length) % matches.length,
      )
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = matches[activeIndex]
      if (isOpen && option) {
        select(option)
      }
    } else if (event.key === 'Escape' && !isOpen && query) {
      event.preventDefault()
      setQuery('')
    }
  }

  return (
    <div ref={rootRef}>
      <SearchInput
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onChange={(value) => {
          setQuery(value)
          setActiveIndex(0)
          if (!isOpen && value) {
            open()
          }
        }}
        onFocus={open}
        onClick={() => {
          if (!isOpen) {
            open()
          }
        }}
        onKeyDown={handleKeyDown}
      />
      {position && (
        <List ref={listRef} style={position}>
          {matches.length > 0 ? (
            matches.map((option, index) => (
              <Option
                key={option.value}
                type="button"
                tabIndex={-1}
                $active={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => select(option)}
              >
                <OptionLabel>{option.label}</OptionLabel>
                {option.description && (
                  <OptionDescription>{option.description}</OptionDescription>
                )}
              </Option>
            ))
          ) : (
            <Empty>{emptyMessage}</Empty>
          )}
        </List>
      )}
    </div>
  )
}

const List = styled.div`
  position: fixed;
  z-index: 30;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space.xs};
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const Option = styled.button<{ $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.sm};
  min-width: 0;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.rowHover : 'none'};
  font: inherit;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  cursor: pointer;
`

const OptionLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`

const OptionDescription = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const Empty = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.md};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`
