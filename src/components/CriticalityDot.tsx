import styled from 'styled-components'
import type { Criticality } from '../models/resource.ts'

export const CriticalityDot = styled.span<{ $criticality?: Criticality }>`
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme, $criticality }) =>
    $criticality ? theme.criticality[$criticality].bg : 'transparent'};
  box-shadow: inset 0 0 0 1px
    ${({ theme, $criticality }) =>
      $criticality ? theme.criticality[$criticality].ring : 'transparent'};
`
