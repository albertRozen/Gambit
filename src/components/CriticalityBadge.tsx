import styled from 'styled-components'
import type { Criticality } from '../models/resource.ts'
import { Badge } from '../ui/Badge.tsx'
import { capitalize } from '../utils/capitalize.ts'

const Root = styled(Badge)<{ $criticality: Criticality }>`
  color: ${({ theme, $criticality }) => theme.criticality[$criticality].fg};
  background: ${({ theme, $criticality }) => theme.criticality[$criticality].bg};
`

export const CriticalityBadge = ({
  criticality,
}: {
  criticality: Criticality
}) => {
  return <Root $criticality={criticality}>{capitalize(criticality)}</Root>
}
