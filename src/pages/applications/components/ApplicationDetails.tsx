import styled from 'styled-components'
import { CriticalityDot } from '../../../components/CriticalityDot.tsx'
import type { Application } from '../../../models/application.ts'
import { CRITICALITY } from '../../../models/resource.ts'
import { Badge } from '../../../ui/Badge.tsx'
import { EmptyState } from '../../../ui/EmptyState.tsx'
import { Panel as PanelBase } from '../../../ui/Panel.tsx'
import { capitalize } from '../../../utils/capitalize.ts'
import { pluralize } from '../../../utils/pluralize.ts'
import { summarizeApplication } from '../summarizeApplication.ts'
import { ApplicationGraph } from './ApplicationGraph.tsx'

interface ApplicationDetailsProps {
  application: Application
}

export const ApplicationDetails = ({
  application,
}: ApplicationDetailsProps) => {
  const { resources, openIssues } = summarizeApplication(application)
  const providers = [...new Set(resources.map(({ provider }) => provider))]

  return (
    <Panel>
      <div>
        <Title>{application.name}</Title>
        {application.description && (
          <Description>{application.description}</Description>
        )}
      </div>

      <Badges>
        <Badge>{pluralize(resources.length, 'resource')}</Badge>
        <Badge>{pluralize(openIssues, 'open issue')}</Badge>
        {providers.length > 0 && <Badge>{providers.join(' · ')}</Badge>}
      </Badges>

      {resources.length > 0 ? (
        <>
          <ApplicationGraph name={application.name} resources={resources} />
          <Legend>
            {CRITICALITY.map((criticality) => (
              <LegendItem key={criticality}>
                <CriticalityDot $criticality={criticality} />
                {capitalize(criticality)}
              </LegendItem>
            ))}
            <LegendNote>Number in a node is its open issue count</LegendNote>
          </Legend>
        </>
      ) : (
        <EmptyState
          title="No resources to show"
          description="The resources in this application no longer exist."
        />
      )}
    </Panel>
  )
}

const Panel = styled(PanelBase).attrs({ as: 'section' })`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  min-width: 0;
  padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.xl};
`

const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
`

const Description = styled.p`
  margin: ${({ theme }) => theme.space.xs} 0 0;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Badges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.sm};
`

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`

const LegendItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
`

const LegendNote = styled.span`
  margin-left: auto;
`
