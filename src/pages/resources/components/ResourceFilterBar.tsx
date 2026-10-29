import styled from 'styled-components'
import { Button } from '../../../ui/Button.tsx'
import { MultiSelect } from '../../../ui/MultiSelect.tsx'
import { SearchInput } from '../../../ui/SearchInput.tsx'
import {
  CRITICALITY,
  ENVIRONMENTS,
  PROVIDERS,
} from '../../../models/resource.ts'
import { capitalize } from '../../../utils/capitalize.ts'
import type { ResourceFilters } from '../filterResources.ts'

const toOptions = <T extends string>(values: readonly T[]) =>
  values.map((value) => ({ value, label: capitalize(value) }))

const PROVIDER_OPTIONS = toOptions(PROVIDERS)
const ENVIRONMENT_OPTIONS = toOptions(ENVIRONMENTS)
const CRITICALITY_OPTIONS = toOptions(CRITICALITY)

interface ResourceFilterBarProps {
  filters: ResourceFilters
  hasActiveFilters: boolean
  onChange: (patch: Partial<ResourceFilters>) => void
  onClear: () => void
}

export const ResourceFilterBar = ({
  filters,
  hasActiveFilters,
  onChange,
  onClear,
}: ResourceFilterBarProps) => {
  return (
    <Bar>
      <Search
        placeholder="Search by name"
        value={filters.query}
        onChange={(query) => onChange({ query })}
      />
      <MultiSelect
        label="Provider"
        options={PROVIDER_OPTIONS}
        selected={filters.providers}
        onChange={(providers) => onChange({ providers })}
      />
      <MultiSelect
        label="Environment"
        options={ENVIRONMENT_OPTIONS}
        selected={filters.environments}
        onChange={(environments) => onChange({ environments })}
      />
      <MultiSelect
        label="Criticality"
        options={CRITICALITY_OPTIONS}
        selected={filters.criticality}
        onChange={(criticality) => onChange({ criticality: criticality })}
      />
      {hasActiveFilters && (
        <ClearFilters type="button" $variant="link" onClick={onClear}>
          Clear filters
        </ClearFilters>
      )}
    </Bar>
  )
}

const Bar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`

const Search = styled(SearchInput)`
  width: 65rem;
  max-width: 100%;
`

const ClearFilters = styled(Button)`
  padding: 0 ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.link};
`
