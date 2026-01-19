import connection from './connection.ts'

const db = connection

export async function giveAd(id: string) {
  return await db('users').where('authId', id).update('admin', true)
}
