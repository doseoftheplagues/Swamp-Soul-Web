import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getUpcomingShows,
  getUpcomingShowById,
  addUpcomingShow,
  deleteUpcomingShow,
  updateUpcomingShow,
} from '../apis/upcomingShows'
import { UpcomingShowData } from '../../models/upcomingShow'

export function useUpcomingShows() {
  const query = useQuery({
    queryKey: ['upcoming_shows'],
    queryFn: () => getUpcomingShows(),
  })
  return {
    ...query,
  }
}

export function useGetUpcomingShowById(id: number) {
  const query = useQuery({
    queryKey: [`upcoming-show-${id}`],
    queryFn: () => getUpcomingShowById(id),
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

interface UpdateShowVariables {
  id: number
  data: UpcomingShowData
}

export function useUpdateUpcomingShow() {
  const mutationFn = (variables: UpdateShowVariables) => {
    return updateUpcomingShow(variables.id, variables.data)
  }
  return useUpcomingShowsMutation(mutationFn)
}
