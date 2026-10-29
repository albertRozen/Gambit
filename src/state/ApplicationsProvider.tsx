import { useEffect, useState, type ReactNode } from 'react'
import type { Application } from '../models/application.ts'
import {
  ApplicationsContext,
  type ApplicationsContextValue,
} from './ApplicationsContext.ts'
import { loadApplications, saveApplications } from './applicationsStorage.ts'

export const ApplicationsProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState(loadApplications)

  useEffect(() => {
    saveApplications(applications)
  }, [applications])

  const value: ApplicationsContextValue = {
    applications,
    createApplication: (input) => {
      const application: Application = { ...input, id: crypto.randomUUID() }
      setApplications((current) => [...current, application])
      return application
    },
    updateApplication: (id, changes) =>
      setApplications((current) =>
        current.map((application) =>
          application.id === id ? { ...application, ...changes } : application,
        ),
      ),
    deleteApplication: (id) =>
      setApplications((current) =>
        current.filter((application) => application.id !== id),
      ),
  }

  return <ApplicationsContext value={value}>{children}</ApplicationsContext>
}
