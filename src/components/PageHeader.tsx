import type { ReactNode } from 'react'
import styled from 'styled-components'

interface PageHeaderProps {
  title: string
  meta?: ReactNode
}

export const PageHeader = ({ title, meta }: PageHeaderProps) => (
  <Root>
    <Title>{title}</Title>
    {meta !== undefined && <Meta>{meta}</Meta>}
  </Root>
)

const Root = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.md};
`

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
`

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`
