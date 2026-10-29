import { collapseWhitespace } from './collapseWhitespace.ts'

export const matchesQuery = (text: string, query: string) =>
  collapseWhitespace(text)
    .toLowerCase()
    .includes(collapseWhitespace(query).toLowerCase())
