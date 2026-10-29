import { css } from 'styled-components'

export const selectableRowStyles = css<{ $selected: boolean }>`
  cursor: pointer;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.selectedRow : 'transparent'};

  &:hover {
    background: ${({ theme, $selected }) =>
      $selected ? theme.colors.selectedRow : theme.colors.rowHover};
  }
`
