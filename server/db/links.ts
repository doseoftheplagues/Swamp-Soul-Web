import { Link } from '../../models/link.ts'
import connection from './connection.ts'

const db = connection

export async function getLinks(): Promise<Link[]> {
  return db('links').select('*')
}

export async function addLink(link: Omit<Link, 'id'>): Promise<Link> {
  const [newLink] = await db('links').insert(link).returning('*')
  return newLink
}

export async function deleteLink(id: number, authId?: string): Promise<void> {
  const query = db('links').where('id', id)
  if (authId) {
    query.where('user_id', authId)
  }
  await query.delete()
}
