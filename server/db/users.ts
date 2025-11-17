import connection from './connection.ts'
import { User, UserData } from '../../models/user.ts'

const db = connection

const columns = ['authId', 'username', 'bio', 'status', 'email']

export async function getUserById(id: string) {
  const result = await db('users').where('authid', id).first()
  return result
}

export async function addUser(newUser: User): Promise<UserData[]> {
  return db('users')
    .insert(newUser)
    .returning([...columns])
}
