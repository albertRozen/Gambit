import { useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'
import { ApplicationFormDialog } from '../../components/ApplicationFormDialog.tsx'
import { PageHeader } from '../../components/PageHeader.tsx'
import { resources } from '../../data/resources.ts'
import { criticalityRank } from '../../models/resource.ts'
import { Button } from '../../ui/Button.tsx'
import { EmptyState } from '../../ui/EmptyState.tsx'
import { ResourceFilterBar } from './components/ResourceFilterBar.tsx'
import { ResourceTable } from './components/ResourceTable.tsx'
import { SelectionBar } from './components/SelectionBar.tsx'
import { filterResources } from './filterResources.ts'
import { useResourceFilters } from './useResourceFilters.ts'

const sortedResources = resources.toSorted(
  (a, b) =>
    criticalityRank(b.criticality) - criticalityRank(a.criticality) ||
    b.openIssues - a.openIssues,
)

export const ResourcesPage = () => {
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useResourceFilters()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const navigate = useNavigate()
  const visibleResources = filterResources(sortedResources, filters)
  const selectedResources = sortedResources.filter(({ id }) =>
    selectedIds.includes(id),
  )

  const toggle = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    )

  const toggleAll = () => {
    const visibleIds = visibleResources.map(({ id }) => id)
    setSelectedIds((current) => {
      const allSelected = visibleIds.every((id) => current.includes(id))
      return allSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : [...current, ...visibleIds.filter((id) => !current.includes(id))]
    })
  }

  return (
    <Section>
      <PageHeader
        title="Resources"
        meta={
          hasActiveFilters
            ? `${visibleResources.length} of ${resources.length}`
            : resources.length
        }
      />
      <ResourceFilterBar
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onChange={updateFilters}
        onClear={clearFilters}
      />
      <ResourceTable
        resources={visibleResources}
        selectedIds={selectedIds}
        onToggle={toggle}
        onToggleAll={toggleAll}
        emptyState={
          <EmptyState
            title="No resources match your filters"
            description="Try a different name or remove a filter."
            action={<Button onClick={clearFilters}>Clear filters</Button>}
          />
        }
      />
      {selectedIds.length > 0 && (
        <SelectionBar
          selectedCount={selectedIds.length}
          onClear={() => setSelectedIds([])}
          onCreate={() => setIsCreating(true)}
        />
      )}
      {isCreating && (
        <ApplicationFormDialog
          resources={selectedResources}
          onClose={() => setIsCreating(false)}
          onSaved={(application) => {
            navigate(`/applications/${application.id}`)
          }}
        />
      )}
    </Section>
  )
}

const Section = styled.section`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`
