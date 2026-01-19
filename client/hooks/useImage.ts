import {
  MutationFunction,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import * as API from '../apis/upload'

export function useImage() {
  return {
    deleteImage: useDeleteImage(),
  }
}

export function useImageMutation<TData = unknown, TVariables = unknown>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  return mutation
}

interface DeleteImageVariables {
  token: string
  url: string
}

function useDeleteImage() {
  const mutationFn = (variables: DeleteImageVariables) => {
    return API.deleteImage(variables.url, variables.token)
  }
  return useImageMutation(mutationFn)
}
