import styled from 'styled-components'
import { fieldStyles } from './fieldStyles.ts'

export const Input = styled.input<{ $invalid?: boolean }>`
  ${fieldStyles}
  height: ${({ theme }) => theme.sizes.control};
  padding: 0 ${({ theme }) => theme.space.md};
`
