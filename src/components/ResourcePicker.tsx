import styled from 'styled-components'
import { resources as allResources, resourcesById } from '../data/resources.ts'
import type { Resource } from '../models/resource.ts'
import { Combobox } from '../ui/Combobox.tsx'
import { IconButton } from '../ui/IconButton.tsx'
import { CloseIcon } from '../ui/icons.tsx'
import { CriticalityBadge } from './CriticalityBadge.tsx'

interface ResourcePickerProps {
  value: Resource[]
  onChange: (resources: Resource[]) => void
}

export const ResourcePicker = ({ value, onChange }: ResourcePickerProps) => {
  const availableResources = allResources
    .filter(({ id }) => !value.some((resource) => resource.id === id))
    .toSorted((a, b) => a.name.localeCompare(b.name))

  const add = (id: string) => {
    const resource = resourcesById.get(id)
    if (resource) {
      onChange([...value, resource])
    }
  }

  const remove = (id: string) =>
    onChange(value.filter((resource) => resource.id !== id))

  return (
    <>
      {value.length > 0 && (
        <List>
          {value.map((resource) => (
            <ResourceRow
              key={resource.id}
              resource={resource}
              onRemove={
                value.length > 1 ? () => remove(resource.id) : undefined
              }
            />
          ))}
        </List>
      )}
      {availableResources.length > 0 && (
        <Combobox
          placeholder="Search resources to add"
          emptyMessage="No resources match"
          options={availableResources.map((resource) => ({
            value: resource.id,
            label: resource.name,
            description: `${resource.provider} · ${resource.type}`,
          }))}
          onSelect={add}
        />
      )}
    </>
  )
}

interface ResourceRowProps {
  resource: Resource
  onRemove?: () => void
}

const ResourceRow = ({ resource, onRemove }: ResourceRowProps) => (
  <Row>
    <Name title={resource.name}>{resource.name}</Name>
    <Provider>{resource.provider}</Provider>
    <CriticalityBadge criticality={resource.criticality} />
    {onRemove && (
      <RemoveButton title="Remove from application" onClick={onRemove}>
        <CloseIcon />
      </RemoveButton>
    )}
  </Row>
)

const List = styled.ul`
  max-height: 60rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
`

const RemoveButton = styled(IconButton)`
  grid-column: 4;
  opacity: 0;
`

const Row = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 44rem) minmax(0, 1fr) auto 6rem;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
  }

  &:hover ${RemoveButton}, &:focus-within ${RemoveButton} {
    opacity: 1;
  }

  @media (hover: none) {
    ${RemoveButton} {
      opacity: 1;
    }
  }
`

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`

const Provider = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`
