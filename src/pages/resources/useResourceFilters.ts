import { useSearchParams } from 'react-router'
import { CRITICALITY, ENVIRONMENTS, PROVIDERS } from '../../models/resource.ts'
import type { ResourceFilters } from './filterResources.ts'

const readList = <T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] => {
  const values = params.get(key)?.split(',') ?? []
  return allowed.filter((value) => values.includes(value))
}

const parseFilters = (params: URLSearchParams): ResourceFilters => ({
  query: params.get('q') ?? '',
  providers: readList(params, 'provider', PROVIDERS),
  environments: readList(params, 'environment', ENVIRONMENTS),
  criticality: readList(params, 'criticality', CRITICALITY),
})

const toSearchParams = (filters: ResourceFilters) => {
  const params = new URLSearchParams()
  if (filters.query.trim()) {
    params.set('q', filters.query)
  }
  if (filters.providers.length > 0) {
    params.set('provider', filters.providers.join(','))
  }
  if (filters.environments.length > 0) {
    params.set('environment', filters.environments.join(','))
  }
  if (filters.criticality.length > 0) {
    params.set('criticality', filters.criticality.join(','))
  }
  return params
}

export const useResourceFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseFilters(searchParams)

  const updateFilters = (patch: Partial<ResourceFilters>) =>
    setSearchParams(
      (current) => toSearchParams({ ...parseFilters(current), ...patch }),
      { replace: true },
    )

  const clearFilters = () => setSearchParams({}, { replace: true })

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.providers.length > 0 ||
    filters.environments.length > 0 ||
    filters.criticality.length > 0

  return { filters, updateFilters, clearFilters, hasActiveFilters }
}
