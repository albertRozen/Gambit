import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'
import { ApplicationFormDialog } from '../../components/ApplicationFormDialog.tsx'
import { PageHeader } from '../../components/PageHeader.tsx'
import type { Application } from '../../models/application.ts'
import { useApplications } from '../../state/ApplicationsContext.ts'
import { Button } from '../../ui/Button.tsx'
import { EmptyState } from '../../ui/EmptyState.tsx'
import { ApplicationDetails } from './components/ApplicationDetails.tsx'
import { ApplicationList } from './components/ApplicationList.tsx'
import { DeleteApplicationDialog } from './components/DeleteApplicationDialog.tsx'
import { summarizeApplication } from './summarizeApplication.ts'

interface PendingAction {
  type: 'edit' | 'delete'
  application: Application
}

export const ApplicationsPage = () => {
  const { applications, deleteApplication } = useApplications()
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const [action, setAction] = useState<PendingAction | null>(null)
  const sortedApplications = applications.toSorted((a, b) =>
    a.name.localeCompare(b.name),
  )
  const selectedApplication =
    sortedApplications.find(({ id }) => id === applicationId) ??
    sortedApplications.at(0)

  return (
    <Section>
      <PageHeader title="Applications" />
      {selectedApplication ? (
        <Layout>
          <ApplicationList
            applications={sortedApplications}
            selectedId={selectedApplication.id}
            onSelect={(id) => navigate(`/applications/${id}`)}
            onEdit={(application) => setAction({ type: 'edit', application })}
            onDelete={(application) =>
              setAction({ type: 'delete', application })
            }
          />
          <ApplicationDetails application={selectedApplication} />
        </Layout>
      ) : (
        <EmptyState
          title="Create your first application"
          description="Select resources on the Resources page, then group them into an application."
          action={
            <Button $variant="primary" onClick={() => navigate('/resources')}>
              Go to resources
            </Button>
          }
        />
      )}

      {action?.type === 'edit' && (
        <ApplicationFormDialog
          application={action.application}
          resources={summarizeApplication(action.application).resources}
          onClose={() => setAction(null)}
          onSaved={() => setAction(null)}
        />
      )}
      {action?.type === 'delete' && (
        <DeleteApplicationDialog
          application={action.application}
          onClose={() => setAction(null)}
          onConfirm={() => {
            setAction(null)
            deleteApplication(action.application.id)
            if (action.application.id === applicationId) {
              navigate('/applications', { replace: true })
            }
          }}
        />
      )}
    </Section>
  )
}

const Section = styled.section`
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 260rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

const Layout = styled.div`
  flex: 0 1 auto;
  min-height: 0;
  display: grid;
  grid-template-columns: 70rem minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.lg};

  @media ${({ theme }) => theme.media.narrow} {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto;
  }
`
