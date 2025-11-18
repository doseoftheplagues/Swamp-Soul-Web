import {
  MutationFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import * as API from '../apis/users'
import { useAuth0 } from '@auth0/auth0-react'

export function useUser() {
  const { getAccessTokenSilently, user } = useAuth0()

  const query = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return API.getUser({ token })
    },
    enabled: !!user,
  })
  return {
    ...query,
    add: useAddUser(),
    update: useUpdateUser(),
  }
}

export function useUserMutation<TData = unknown, TVariables = unknown>(
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

function useAddUser() {
  return useUserMutation(API.addUser)
}

function useUpdateUser() {
  return useUserMutation(API.editUser)
}
