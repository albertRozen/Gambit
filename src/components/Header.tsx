import { NavLink } from 'react-router'
import styled from 'styled-components'
import { useApplications } from '../state/ApplicationsContext.ts'
import { Badge } from '../ui/Badge.tsx'

export const Header = () => {
  const { applications } = useApplications()

  return (
    <Root>
      <Logo>Gambit</Logo>
      <Nav>
        <Tab to="/resources">Resources</Tab>
        <Tab to="/applications">
          Applications
          <Badge>{applications.length}</Badge>
        </Tab>
      </Nav>
    </Root>
  )
}

const Root = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxl};
  height: ${({ theme }) => theme.sizes.header};
  padding: 0
    calc(
      max(0rem, (100% - ${({ theme }) => theme.sizes.content}) / 2) +
        ${({ theme }) => theme.space.xl}
    );
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const Logo = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;

  &::before {
    content: '';
    width: 5rem;
    height: 5rem;
    border-radius: 1.5rem;
    background: ${({ theme }) => theme.colors.accent};
  }
`

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.space.xl};
`

const Tab = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.xs} 0;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: none;
  transition:
    color 120ms ease,
    border-color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.text};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -2px;
  }
`
