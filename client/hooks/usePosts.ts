import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addPost,
  deletePost,
  getPostById,
  getPostsByUserId,
  updatePost,
} from '../apis/posts'
import { PostData } from '../../models/post'

export function usePostsByUserId(userId?: string) {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => getPostsByUserId(userId!),
    enabled: !!userId,
  })
}

export function usePostById(postId: number) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })
}

export function usePosts() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postData,
      token,
    }: {
      postData: PostData
      token: string
    }) => addPost(postData, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      postId,
      postData,
      token,
    }: {
      postId: number
      postData: PostData
      token: string
    }) => updatePost(postId, postData, token),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ postId, token }: { postId: number; token: string }) =>
      deletePost(postId, token),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] })
    },
  })
}
