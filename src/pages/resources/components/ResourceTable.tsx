import type { ReactNode } from 'react'
import styled from 'styled-components'
import { CriticalityBadge } from '../../../components/CriticalityBadge.tsx'
import type { Resource } from '../../../models/resource.ts'
import { Checkbox } from '../../../ui/Checkbox.tsx'
import { Panel } from '../../../ui/Panel.tsx'
import { selectableRowStyles } from '../../../styles/selectableRowStyles.ts'
import { capitalize } from '../../../utils/capitalize.ts'

const CHECKBOX_COLUMN_WIDTH = '11rem'

const COLUMNS = [
  { label: 'Name' },
  { label: 'Type', width: '42rem' },
  { label: 'Provider', width: '24rem' },
  { label: 'Environment', width: '32rem' },
  { label: 'Criticality', width: '28rem' },
  { label: 'Open issues', width: '28rem', numeric: true },
]

interface ResourceTableProps {
  resources: Resource[]
  selectedIds: readonly string[]
  onToggle: (id: string) => void
  onToggleAll: () => void
  emptyState: ReactNode
}

export const ResourceTable = ({
  resources,
  selectedIds,
  onToggle,
  onToggleAll,
  emptyState,
}: ResourceTableProps) => {
  const selectedCount = resources.filter(({ id }) =>
    selectedIds.includes(id),
  ).length
  const allSelected = resources.length > 0 && selectedCount === resources.length
  const someSelected = selectedCount > 0 && !allSelected

  return (
    <Wrapper>
      <Table>
        <colgroup>
          <col style={{ width: CHECKBOX_COLUMN_WIDTH }} />
          {COLUMNS.map(({ label, width }) => (
            <col key={label} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th>
              <Checkbox
                ref={(element) => {
                  if (element) {
                    element.indeterminate = someSelected
                  }
                }}
                checked={allSelected}
                disabled={resources.length === 0}
                onChange={onToggleAll}
              />
            </th>
            {COLUMNS.map(({ label, numeric }) =>
              numeric ? (
                <NumericHeader key={label}>{label}</NumericHeader>
              ) : (
                <th key={label}>{label}</th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {resources.length === 0 && (
            <tr>
              <EmptyCell colSpan={COLUMNS.length + 1}>{emptyState}</EmptyCell>
            </tr>
          )}
          {resources.map((resource) => {
            const isSelected = selectedIds.includes(resource.id)

            return (
              <Row
                key={resource.id}
                $selected={isSelected}
                onClick={() => onToggle(resource.id)}
              >
                <td>
                  <Checkbox checked={isSelected} readOnly />
                </td>
                <td>
                  <Name title={resource.name}>{resource.name}</Name>
                  <Meta>{resource.region}</Meta>
                </td>
                <td title={resource.type}>{resource.type}</td>
                <td>{resource.provider}</td>
                <td>{capitalize(resource.environment)}</td>
                <td>
                  <CriticalityBadge criticality={resource.criticality} />
                </td>
                <IssuesCell $muted={resource.openIssues === 0}>
                  {resource.openIssues}
                </IssuesCell>
              </Row>
            )
          })}
        </tbody>
      </Table>
    </Wrapper>
  )
}

const HEADER_HEIGHT = '9rem'
const ROW_HEIGHT = '13rem'
const VISIBLE_ROWS = 8

const Wrapper = styled(Panel)`
  flex: 0 1 auto;
  height: calc(${HEADER_HEIGHT} + ${VISIBLE_ROWS} * ${ROW_HEIGHT} + 2px);
  min-height: calc(${HEADER_HEIGHT} + 3 * ${ROW_HEIGHT} + 2px);
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
  min-width: 220rem;
  border-collapse: collapse;
  table-layout: fixed;

  th,
  td {
    padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  th {
    height: ${HEADER_HEIGHT};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textMuted};
    position: sticky;
    top: 0;
    z-index: 1;
    background: ${({ theme }) => theme.colors.surface};
    box-shadow: inset 0 -1px 0 ${({ theme }) => theme.colors.border};
  }

  td {
    height: ${ROW_HEIGHT};
  }

  tbody tr + tr td {
    border-top: 1px solid ${({ theme }) => theme.colors.surfaceMuted};
  }
`

const NumericHeader = styled.th`
  && {
    text-align: right;
  }
`

const Row = styled.tr<{ $selected: boolean }>`
  ${selectableRowStyles}
`

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
`

const Meta = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const EmptyCell = styled.td`
  && {
    white-space: normal;
  }
`

const IssuesCell = styled.td<{ $muted: boolean }>`
  && {
    text-align: right;
  }
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $muted }) =>
    $muted ? theme.colors.textMuted : theme.colors.text};
`
