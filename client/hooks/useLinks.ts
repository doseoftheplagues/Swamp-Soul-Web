import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLinksByUserId,
  addLink as apiAddLink,
  deleteLink as apiDeleteLink,
} from '../apis/links'
import { Link } from '../../models/link'

export function useLinks(userId?: string) {
  const queryClient = useQueryClient()

  const {
    data: links,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['links', userId],
    queryFn: () => getLinksByUserId(userId),
  })

  const addLinkMutation = useMutation({
    mutationFn: ({ link, token }: { link: Omit<Link, 'id'>; token: string }) =>
      apiAddLink({ link, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  const deleteLinkMutation = useMutation({
    mutationFn: ({ id, token }: { id: number; token: string }) =>
      apiDeleteLink({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] })
    },
  })

  return {
    links: links || [],
    isLoading,
    isError,
    addLink: addLinkMutation,
    deleteLink: deleteLinkMutation,
  }
}
