import { useRef, useState } from 'react'
import styled from 'styled-components'
import { Checkbox } from './Checkbox.tsx'
import { IconButton } from './IconButton.tsx'
import { ChevronDownIcon, CloseIcon } from './icons.tsx'
import { useDismiss } from './useDismiss.ts'

interface MultiSelectOption<T extends string> {
  value: T
  label: string
}

interface MultiSelectProps<T extends string> {
  label: string
  options: readonly MultiSelectOption<T>[]
  selected: readonly T[]
  onChange: (selected: T[]) => void
}

export const MultiSelect = <T extends string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useDismiss(isOpen, rootRef, triggerRef, () => setIsOpen(false))

  const toggle = (value: T) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    onChange(
      options
        .map((option) => option.value)
        .filter((item) => next.includes(item)),
    )
  }

  const clear = () => {
    onChange([])
    triggerRef.current?.focus()
  }

  const selectedLabels = options
    .filter((option) => selected.includes(option.value))
    .map((option) => option.label)
  const isActive = selectedLabels.length > 0

  return (
    <Root ref={rootRef}>
      <Control $active={isActive}>
        <Trigger
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isActive ? (
            <Summary>
              {label}: {selectedLabels.join(', ')}
            </Summary>
          ) : (
            <>
              {label}
              <ChevronDownIcon />
            </>
          )}
        </Trigger>
        {isActive && (
          <ClearButton type="button" onClick={clear}>
            <CloseIcon />
          </ClearButton>
        )}
      </Control>
      {isOpen && (
        <Menu role="group">
          {options.map((option) => (
            <Option key={option.value}>
              <Checkbox
                checked={selected.includes(option.value)}
                onChange={() => toggle(option.value)}
              />
              {option.label}
            </Option>
          ))}
        </Menu>
      )}
    </Root>
  )
}

const Root = styled.div`
  position: relative;
`

const Control = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  height: ${({ theme }) => theme.sizes.control};
  border: 1px solid
    ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentSubtle : theme.colors.surface};
  transition: border-color 120ms ease;

  &:hover {
    border-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary : theme.colors.borderHover};
  }
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 100%;
  padding: 0 ${({ theme }) => theme.space.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: none;
  font: inherit;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  svg {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -1px;
  }
`

const Summary = styled.span`
  max-width: 60rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ClearButton = styled(IconButton)`
  margin: 0 ${({ theme }) => theme.space.sm} 0 -${({ theme }) => theme.space.xs};
`

const Menu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.space.xs});
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  min-width: max(100%, 45rem);
  padding: ${({ theme }) => theme.space.xs};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const Option = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.sm};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.rowHover};
  }
`
