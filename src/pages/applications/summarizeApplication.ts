import { resourcesById } from '../../data/resources.ts'
import type { Application } from '../../models/application.ts'
import {
  criticalityRank,
  type Criticality,
  type Resource,
} from '../../models/resource.ts'

interface ApplicationSummary {
  resources: Resource[]
  openIssues: number
  highestCriticality?: Criticality
}

export const summarizeApplication = (
  application: Application,
): ApplicationSummary => {
  const resources = application.resourceIds
    .map((id) => resourcesById.get(id))
    .filter((resource) => resource !== undefined)

  const openIssues = resources.reduce(
    (total, resource) => total + resource.openIssues,
    0,
  )

  const highestCriticality = resources.reduce<Criticality | undefined>(
    (highest, { criticality }) =>
      highest === undefined ||
      criticalityRank(criticality) > criticalityRank(highest)
        ? criticality
        : highest,
    undefined,
  )

  return { resources, openIssues, highestCriticality }
}
