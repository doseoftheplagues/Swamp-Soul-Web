import { useQuery } from '@tanstack/react-query'
import { getShows } from '../apis/shows'

export function useShows() {
  const query = useQuery({ queryKey: ['shows'], queryFn: getShows })
  return {
    ...query,
  }
}
