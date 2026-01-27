import request from 'superagent'
import { AdminMessage, NewAdminMessage } from '../../models/adminMessage.ts'

const rootURL = new URL(`/api/v1/adminmessages`, document.baseURI)

export async function getAdminMessagesByUserId(
  userId: string,
  token: string,
): Promise<AdminMessage[]> {
  const response = await request
    .get(`${rootURL}/user/${userId}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as AdminMessage[]
}

export async function getAllAdminMessages(token: string): Promise<AdminMessage[]> {
  const response = await request
    .get(rootURL.toString())
    .set('Authorization', `Bearer ${token}`)
  return response.body as AdminMessage[]
}

export async function addAdminMessage(
  newMessage: Omit<NewAdminMessage, 'adminId'>,
  token: string,
): Promise<AdminMessage> {
  const response = await request
    .post(rootURL.toString())
    .set('Authorization', `Bearer ${token}`)
    .send(newMessage)
  return response.body as AdminMessage
}

export async function deleteAdminMessage(
  id: number,
  token: string,
): Promise<number> {
  const response = await request
    .delete(`${rootURL}/${id}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body // Assuming it returns the number of deleted rows or a success indicator
}
