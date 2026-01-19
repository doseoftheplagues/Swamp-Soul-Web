import request from 'superagent'
import { PostData } from '../../models/post'

const rootURL = new URL(`/api/v1/posts`, document.baseURI)

export async function getPostsByUserId(userId: string) {
  const response = await request.get(`${rootURL}/user/${userId}`)
  return response.body
}

export async function getPostById(postId: number) {
  const response = await request.get(`${rootURL}/${postId}`)
  return response.body
}

export async function addPost(postData: PostData, token: string) {
  const response = await request
    .post(rootURL.toString())
    .set('Authorization', `Bearer ${token}`)
    .send(postData)
  return response.body
}

export async function updatePost(postId: number, postData: PostData, token: string) {
  await request
    .put(`${rootURL}/${postId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(postData)
}

export async function deletePost(postId: number, token: string) {
  await request.delete(`${rootURL}/${postId}`).set('Authorization', `Bearer ${token}`)
}