export type Provider = 'AWS' | 'GCP' | 'Azure'
export type Environment = 'production' | 'staging' | 'development'
export type Criticality = 'low' | 'medium' | 'high' | 'critical'

export interface Resource {
  id: string
  name: string
  type: string
  provider: Provider
  region: string
  environment: Environment
  criticality: Criticality
  owner: string
  tags: string[]
  openIssues: number
}

export const PROVIDERS: Provider[] = ['AWS', 'GCP', 'Azure']

export const ENVIRONMENTS: Environment[] = [
  'production',
  'staging',
  'development',
]

export const CRITICALITY: Criticality[] = ['low', 'medium', 'high', 'critical']

export const criticalityRank = (criticality: Criticality) =>
  CRITICALITY.indexOf(criticality)
