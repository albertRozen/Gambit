import type { ComponentProps } from 'react'
import styled from 'styled-components'
import { SearchIcon } from './icons.tsx'
import { Input } from './Input.tsx'

interface SearchInputProps extends Omit<
  ComponentProps<'input'>,
  'type' | 'onChange'
> {
  onChange: (value: string) => void
}

export const SearchInput = ({
  className,
  onChange,
  ...inputProps
}: SearchInputProps) => {
  return (
    <Root className={className}>
      <SearchIcon />
      <Field
        {...inputProps}
        type="search"
        onChange={(event) => onChange(event.target.value)}
      />
    </Root>
  )
}

const Root = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};

  svg {
    position: absolute;
    left: ${({ theme }) => theme.space.md};
    pointer-events: none;
  }
`

const Field = styled(Input)`
  width: 100%;
  padding-left: 9rem;

  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`
