import styled from 'styled-components'
import { Button } from '../../../ui/Button.tsx'
import { PlusIcon } from '../../../ui/icons.tsx'

interface SelectionBarProps {
  selectedCount: number
  onClear: () => void
  onCreate: () => void
}

export const SelectionBar = ({
  selectedCount,
  onClear,
  onCreate,
}: SelectionBarProps) => (
  <Root>
    <Summary>{selectedCount} selected</Summary>
    <ClearButton type="button" $variant="link" onClick={onClear}>
      Clear
    </ClearButton>
    <Button type="button" onClick={onCreate}>
      <PlusIcon />
      Create application
    </Button>
  </Root>
)

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-self: center;
  align-items: center;
  max-width: 100%;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.sm};
  padding-left: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.onPrimary};
  background: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.md};
`

const Summary = styled.span`
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const ClearButton = styled(Button)`
  font-weight: 400;
  color: ${({ theme }) => theme.colors.onPrimaryMuted};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.onPrimary};
  }

  &:focus-visible {
    outline-color: ${({ theme }) => theme.colors.onPrimary};
  }
`
