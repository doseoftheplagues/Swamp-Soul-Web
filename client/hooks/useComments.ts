import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCommentsByUpcomingShowId,
  getCommentsByArchiveShowId,
  getCommentsByPostId,
  getCommentsByParentId,
  addComment as addCommentApi,
  deleteComment as deleteCommentApi,
} from '../apis/comments'
import { CommentData } from '../../models/comment'

interface UseCommentsParams {
  upcomingShowId?: number
  archiveShowId?: number
  postId?: number
  parentId?: number
}

export function useComments({
  upcomingShowId,
  archiveShowId,
  postId,
  parentId,
}: UseCommentsParams = {}) {
  const queryClient = useQueryClient()

  const {
    data: comments,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['comments', { upcomingShowId, archiveShowId, postId, parentId }],
    queryFn: () => {
      if (upcomingShowId) return getCommentsByUpcomingShowId(upcomingShowId)
      if (archiveShowId) return getCommentsByArchiveShowId(archiveShowId)
      if (postId) return getCommentsByPostId(postId)
      if (parentId) return getCommentsByParentId(parentId)
      return Promise.resolve([])
    },
    enabled: !!(upcomingShowId || archiveShowId || postId || parentId),
  })

  const addCommentMutation = useMutation({
    mutationFn: ({ comment, token }: { comment: CommentData; token: string }) =>
      addCommentApi({ comment, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const deleteCommentMutation = useMutation({
    mutationFn: ({ commentId, token }: { commentId: number; token: string }) =>
      deleteCommentApi({ commentId, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  return {
    comments: comments || [],
    isLoading,
    isError,
    addComment: addCommentMutation,
    deleteComment: deleteCommentMutation,
  }
}
