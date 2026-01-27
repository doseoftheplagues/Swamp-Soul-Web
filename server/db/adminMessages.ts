import db from './connection.js'
import { AdminMessage, NewAdminMessage } from '../../models/adminMessage.ts'

export async function addAdminMessage(
  newMessage: NewAdminMessage,
): Promise<AdminMessage> {
  const messageToInsert = {
    admin_id: newMessage.adminId,
    user_id: newMessage.userId,
    content_deleted: newMessage.contentDeleted,
    reason_deleted: newMessage.reasonDeleted,
  }
  const [insertedId] = await db('admin_messages').insert(messageToInsert)
  const result = await db('admin_messages').where('id', insertedId).first()
  return {
    id: result.id,
    adminId: result.admin_id,
    userId: result.user_id,
    contentDeleted: result.content_deleted,
    reasonDeleted: result.reason_deleted,
  }
}

export async function getAdminMessagesByUserId(
  userId: string,
): Promise<AdminMessage[]> {
  const results = await db('admin_messages').where('user_id', userId).select()
  return results.map((result) => ({
    id: result.id,
    adminId: result.admin_id,
    userId: result.user_id,
    contentDeleted: result.content_deleted,
    reasonDeleted: result.reason_deleted,
  }))
}

export async function getAllAdminMessages(): Promise<AdminMessage[]> {
  const results = await db('admin_messages').select()
  return results.map((result) => ({
    id: result.id,
    adminId: result.admin_id,
    userId: result.user_id,
    contentDeleted: result.content_deleted,
    reasonDeleted: result.reason_deleted,
  }))
}

export async function deleteAdminMessage(id: number): Promise<number> {
  return db('admin_messages').where('id', id).del()
}
