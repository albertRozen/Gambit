import styled from 'styled-components'

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
  line-height: 4.5rem;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`
