import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { CriticalityDot } from '../../../components/CriticalityDot.tsx'
import type { Application } from '../../../models/application.ts'
import { PencilIcon, TrashIcon } from '../../../ui/icons.tsx'
import { Menu } from '../../../ui/Menu.tsx'
import { Panel as PanelBase } from '../../../ui/Panel.tsx'
import { SearchInput } from '../../../ui/SearchInput.tsx'
import { selectableRowStyles } from '../../../styles/selectableRowStyles.ts'
import { matchesQuery } from '../../../utils/matchesQuery.ts'
import { pluralize } from '../../../utils/pluralize.ts'
import { summarizeApplication } from '../summarizeApplication.ts'

interface ApplicationListProps {
  applications: Application[]
  selectedId: string
  onSelect: (id: string) => void
  onEdit: (application: Application) => void
  onDelete: (application: Application) => void
}

export const ApplicationList = ({
  applications,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
}: ApplicationListProps) => {
  const [query, setQuery] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const selectedItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const body = bodyRef.current
    const item = selectedItemRef.current

    if (!body || !item) {
      return
    }

    const bodyRect = body.getBoundingClientRect()
    const itemRect = item.getBoundingClientRect()
    const hiddenAbove = bodyRect.top - itemRect.top
    const hiddenBelow = itemRect.bottom - bodyRect.bottom

    if (hiddenAbove > 0) {
      body.scrollTop -= hiddenAbove
    } else if (hiddenBelow > 0) {
      body.scrollTop += hiddenBelow
    }
  }, [selectedId])

  const visibleApplications = applications.filter((application) =>
    matchesQuery(application.name, query),
  )

  return (
    <Panel>
      <SearchInput
        placeholder="Search applications"
        value={query}
        onChange={setQuery}
      />
      <Body ref={bodyRef}>
        {visibleApplications.length > 0 ? (
          <List>
            {visibleApplications.map((application) => {
              const { resources, openIssues, highestCriticality } =
                summarizeApplication(application)

              return (
                <Row key={application.id}>
                  <Item
                    ref={
                      application.id === selectedId
                        ? selectedItemRef
                        : undefined
                    }
                    type="button"
                    $selected={application.id === selectedId}
                    onClick={() => onSelect(application.id)}
                  >
                    <CriticalityDot $criticality={highestCriticality} />
                    <Text>
                      <Name title={application.name}>{application.name}</Name>
                      <Meta>
                        {pluralize(resources.length, 'resource')} ·{' '}
                        {pluralize(openIssues, 'issue')}
                      </Meta>
                    </Text>
                  </Item>
                  <RowMenu
                    items={[
                      {
                        label: 'Edit',
                        icon: <PencilIcon />,
                        onSelect: () => onEdit(application),
                      },
                      {
                        label: 'Delete',
                        icon: <TrashIcon />,
                        tone: 'danger',
                        onSelect: () => onDelete(application),
                      },
                    ]}
                  />
                </Row>
              )
            })}
          </List>
        ) : (
          <NoMatches>No applications match “{query.trim()}”</NoMatches>
        )}
      </Body>
    </Panel>
  )
}

const ITEM_HEIGHT = '13rem'
const ITEM_GAP = '0.5rem'
const VISIBLE_ITEMS = 12

const Panel = styled(PanelBase)`
  align-self: start;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.sm};
`

const Body = styled.div`
  flex: 0 1 auto;
  height: calc(
    ${VISIBLE_ITEMS} * ${ITEM_HEIGHT} + ${VISIBLE_ITEMS - 1} * ${ITEM_GAP}
  );
  min-height: calc(3 * ${ITEM_HEIGHT} + 2 * ${ITEM_GAP});
  overflow-y: auto;

  @media ${({ theme }) => theme.media.narrow} {
    height: calc(5 * ${ITEM_HEIGHT} + 4 * ${ITEM_GAP});
  }
`

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${ITEM_GAP};
  margin: 0;
  padding: 0;
  list-style: none;
`

const RowMenu = styled(Menu)`
  position: absolute;
  top: 0;
  right: ${({ theme }) => theme.space.sm};
  bottom: 0;
  align-items: center;
  opacity: 0;
`

const Row = styled.li`
  position: relative;

  &:hover ${RowMenu}, &:focus-within ${RowMenu} {
    opacity: 1;
  }

  @media (hover: none) {
    ${RowMenu} {
      opacity: 1;
    }
  }
`

const Item = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
  height: ${ITEM_HEIGHT};
  padding: ${({ theme }) => theme.space.sm} 10rem
    ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  font: inherit;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  ${selectableRowStyles}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: -2px;
  }
`

const Text = styled.span`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
`

const Meta = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  font-variant-numeric: tabular-nums;
`

const NoMatches = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.sm};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`
