import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getUpcomingShows,
  addUpcomingShow,
  deleteUpcomingShow,
  updateUpcomingShow,
} from '../apis/upcomingShows'

export function useUpcomingShows() {
  const query = useQuery({
    queryKey: ['upcoming_shows'],
    queryFn: () => getUpcomingShows(),
  })
  return {
    ...query,
  }
}

export function useUpcomingShowsMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming_shows'] })
    },
  })

  return mutation
}

export function useAddUpcomingShow() {
  return useUpcomingShowsMutation(addUpcomingShow)
}

export function useDeleteUpcomingShow() {
  return useUpcomingShowsMutation(deleteUpcomingShow)
}

export function useUpdateUpcomingShow() {
  return useUpcomingShowsMutation(updateUpcomingShow)
}
