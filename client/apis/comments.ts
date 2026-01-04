import request from 'superagent'
import { Comment, CommentData } from '../../models/comment'

const rootURL = new URL(`/api/v1/comments`, document.baseURI)

export async function getCommentsByUpcomingShowId(id: number) {
  const response = await request.get(`${rootURL}/upcomingshow/${id}`)
  return response.body as Comment[]
}

export async function getCommentsByArchiveShowId(id: number) {
  const response = await request.get(`${rootURL}/archive/${id}`)
  return response.body as Comment[]
}

export async function getCommentsByPostId(id: number) {
  const response = await request.get(`${rootURL}/posts/${id}`)
  return response.body as Comment[]
}

export async function getCommentsByParentId(id: number) {
  const response = await request.get(`${rootURL}/parent/${id}`)
  return response.body as Comment[]
}

interface AddCommentParams {
  comment: CommentData
  token: string
}

export async function addComment({ comment, token }: AddCommentParams) {
  const response = await request
    .post(rootURL.toString())
    .set('Authorization', `Bearer ${token}`)
    .send(comment)
  return response.body
}

interface DeleteCommentParams {
  commentId: number
  token: string
}

export async function deleteComment({ commentId, token }: DeleteCommentParams) {
  const response = await request
    .delete(`${rootURL}/${commentId}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
