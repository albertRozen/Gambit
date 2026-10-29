import { resourcesById } from '../data/resources.ts'
import type { Application } from '../models/application.ts'

const STORAGE_KEY = 'gambit.applications'

const isApplication = (value: unknown): value is Application => {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const { id, name, description, resourceIds } = value as Record<
    string,
    unknown
  >
  return (
    typeof id === 'string' &&
    typeof name === 'string' &&
    (description === undefined || typeof description === 'string') &&
    Array.isArray(resourceIds)
  )
}

export const loadApplications = (): Application[] => {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(saved)) {
      return []
    }

    return saved.filter(isApplication).map((application) => ({
      ...application,
      resourceIds: [...new Set(application.resourceIds)].filter((id) =>
        resourcesById.has(id),
      ),
    }))
  } catch {
    return []
  }
}

export const saveApplications = (applications: Application[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  } catch {}
}
