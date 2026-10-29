import styled from 'styled-components'

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 4rem;
  height: 4rem;
  margin: 0;
  accent-color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`
