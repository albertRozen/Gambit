import styled from 'styled-components'
import { fieldStyles } from './fieldStyles.ts'

export const Textarea = styled.textarea<{ $invalid?: boolean }>`
  ${fieldStyles}
  min-height: 20rem;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  resize: vertical;
`
