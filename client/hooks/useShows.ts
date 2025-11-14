import { useQuery } from '@tanstack/react-query'

import * as API from '../apis/shows.ts'

export function useShows() {
  const { data, ...query } = useQuery({
    queryKey: ['shows'],
    queryFn: () => API.getShows(),
  })
  return {
    shows: data?.shows ?? [], // ⬅️ Fix here
    ...query,
  }
}
