import type { ReactNode } from 'react'
import styled from 'styled-components'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.xxl};
  text-align: center;
`

const Title = styled.p`
  margin: 0;
  font-weight: 600;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Root>
    <Title>{title}</Title>
    {description && <Description>{description}</Description>}
    {action}
  </Root>
)
