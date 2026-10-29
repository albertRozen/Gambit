import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import styled from 'styled-components'
import { Header } from './components/Header.tsx'

const ResourcesPage = lazy(() =>
  import('./pages/resources/ResourcesPage.tsx').then(({ ResourcesPage }) => ({
    default: ResourcesPage,
  })),
)

const ApplicationsPage = lazy(() =>
  import('./pages/applications/ApplicationsPage.tsx').then(
    ({ ApplicationsPage }) => ({ default: ApplicationsPage }),
  ),
)

export const App = () => (
  <>
    <Header />
    <Container>
      <Suspense>
        <Routes>
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route
            path="/applications/:applicationId"
            element={<ApplicationsPage />}
          />
          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </Suspense>
    </Container>
  </>
)

const Container = styled.main`
  display: flex;
  flex-direction: column;
  height: calc(100dvh - ${({ theme }) => theme.sizes.header});
  min-height: 120rem;
  max-width: ${({ theme }) => theme.sizes.content};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.xl};

  @media ${({ theme }) => theme.media.narrow} {
    height: auto;
    padding: ${({ theme }) => theme.space.lg};
  }
`
