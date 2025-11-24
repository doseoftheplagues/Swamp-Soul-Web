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

interface AddShowVariables {
  showData: UpcomingShowData
  token: string
}

export function useAddUpcomingShow() {
  const mutationFn = (variables: AddShowVariables) => {
    return addUpcomingShow(variables.showData, variables.token)
  }
  return useUpcomingShowsMutation(mutationFn)
}

interface DeleteShowVariables {
  id: number
  token: string
}

export function useDeleteUpcomingShow() {
  const mutationFn = (variables: DeleteShowVariables) => {
    return deleteUpcomingShow(variables.id, variables.token)
  }
  return useUpcomingShowsMutation(mutationFn)
}

interface UpdateShowVariables {
  id: number
  showData: UpcomingShowData
  token: string
}

export function useUpdateUpcomingShow() {
  const mutationFn = (variables: UpdateShowVariables) => {
    return updateUpcomingShow(variables.id, variables.showData, variables.token)
  }
  return useUpcomingShowsMutation(mutationFn)
}
