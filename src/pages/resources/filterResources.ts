import type {
  Criticality,
  Environment,
  Provider,
  Resource,
} from '../../models/resource.ts'
import { matchesQuery } from '../../utils/matchesQuery.ts'

export interface ResourceFilters {
  query: string
  providers: Provider[]
  environments: Environment[]
  criticality: Criticality[]
}

const matches = <T>(selected: readonly T[], value: T): boolean =>
  selected.length === 0 || selected.includes(value)

export const filterResources = (
  resources: readonly Resource[],
  filters: ResourceFilters,
): Resource[] =>
  resources.filter(
    (resource) =>
      matchesQuery(resource.name, filters.query) &&
      matches(filters.providers, resource.provider) &&
      matches(filters.environments, resource.environment) &&
      matches(filters.criticality, resource.criticality),
  )
