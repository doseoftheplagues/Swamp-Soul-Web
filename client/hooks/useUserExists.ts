import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import * as API from '../apis/users'

export function useUserExists() {
  const { user, isAuthenticated } = useAuth0()

  const query = useQuery({
    queryKey: ['userExists', user?.sub],
    queryFn: async () => {
      if (!user?.sub) {
        return false
      }
      return API.userCheck(user.sub)
    },
    enabled: isAuthenticated && !!user?.sub,
  })

  return {
    exists: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
