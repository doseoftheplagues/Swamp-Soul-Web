import {
  useQuery,
  useMutation,
  useQueryClient,
  MutationFunction,
} from '@tanstack/react-query'
import * as API from '../apis/posters'

export function usePosters(id: number) {
  const query = useQuery({
    queryKey: ['posters', id],
    queryFn: async () => {
      return API.getPostersByUpcomingShowId(id)
    },
  })
  return {
    ...query,
  }
}

export function usePostersMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posters'] })
    },
  })
  return mutation
}

interface DeletePosterVariables {
  id: number
  token: string
}

export function useDeletePoster() {
  const mutationFn = (variables: DeletePosterVariables) => {
    return API.deletePoster(variables.id, variables.token)
  }
  return usePostersMutation(mutationFn)
}
