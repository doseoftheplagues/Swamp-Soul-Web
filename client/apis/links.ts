import request from 'superagent'
import { Link } from '../../models/link'

const rootURL = new URL('/api/v1/links', document.baseURI)

export async function getLinksByUserId(userId?: string): Promise<Link[]> {
  const url = userId ? `${rootURL}/${userId}` : rootURL.toString()
  const res = await request.get(url)
  return res.body
}

interface AddLinkParams {
  link: Omit<Link, 'id'>
  token: string
}

export async function addLink({ link, token }: AddLinkParams): Promise<Link> {
  const res = await request
    .post(rootURL.toString())
    .set('Authorization', `Bearer ${token}`)
    .send(link)
  return res.body
}

interface DeleteLinkParams {
  id: number
  token: string
}

export async function deleteLink({ id, token }: DeleteLinkParams): Promise<void> {
  await request
    .delete(`${rootURL}/${id}`)
    .set('Authorization', `Bearer ${token}`)
}
