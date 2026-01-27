import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAdminMessagesByUserId,
  getAllAdminMessages,
  addAdminMessage as addAdminMessageApi,
  deleteAdminMessage as deleteAdminMessageApi,
} from '../apis/adminMessages'
import { NewAdminMessage } from '../../models/adminMessage'
import { useAuth0 } from '@auth0/auth0-react'

// Hook to get messages for a specific user
export function useAdminMessagesByUser(userId: string | undefined) {
  const { getAccessTokenSilently } = useAuth0()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminMessages', 'user', userId],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      // Ensure userId is not undefined before calling the API
      if (!userId) {
        throw new Error('User ID is undefined')
      }
      return getAdminMessagesByUserId(userId, token)
    },
    enabled: !!userId,
  })

  return {
    messages: data || [],
    isLoading,
    isError,
  }
}

// Hook for admin actions (get all, add, delete)
export function useAdminMessages() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  // Query to get all admin messages
  const {
    data: allMessages,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery({
    queryKey: ['adminMessages', 'all'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return getAllAdminMessages(token)
    },
  })

  // Mutation to add a new message
  const addMutation = useMutation({
    mutationFn: async (newMessage: Omit<NewAdminMessage, 'adminId'>) => {
      const token = await getAccessTokenSilently()
      return addAdminMessageApi(newMessage, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] })
    },
  })

  // Mutation to delete a message
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = await getAccessTokenSilently()
      return deleteAdminMessageApi(id, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] })
    },
  })

  return {
    allMessages: allMessages || [],
    isLoadingAll,
    isErrorAll,
    add: addMutation,
    delete: deleteMutation,
  }
}
