import { css } from 'styled-components'

export const fieldStyles = css<{ $invalid?: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  font: inherit;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.surface};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -1px;
  }

  ${({ theme, $invalid }) =>
    $invalid &&
    css`
      border-color: ${theme.colors.danger};

      &:focus-visible {
        outline-color: ${theme.colors.danger};
      }
    `}
`
