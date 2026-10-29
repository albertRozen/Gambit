import { createContext, useContext } from 'react'
import type { Application } from '../models/application.ts'

export type ApplicationInput = Omit<Application, 'id'>

export interface ApplicationsContextValue {
  applications: Application[]
  createApplication: (input: ApplicationInput) => Application
  updateApplication: (id: string, changes: ApplicationInput) => void
  deleteApplication: (id: string) => void
}

export const ApplicationsContext =
  createContext<ApplicationsContextValue | null>(null)

export const useApplications = (): ApplicationsContextValue => {
  const context = useContext(ApplicationsContext)
  if (!context) {
    throw new Error('useApplications must be used within ApplicationsProvider')
  }
  return context
}
