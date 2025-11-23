import connection from './connection.ts'
import { User, UserData } from '../../models/user.ts'

const db = connection

const columns = ['authId', 'username', 'bio', 'status', 'email']

export async function getUserById(id: string) {
  const result = await db('users').where('authId', id).first()
  return result
}

export async function addUser(newUser: User): Promise<UserData[]> {
  return db('users')
    .insert(newUser)
    .returning([...columns])
}

export async function usernameTakenCheck(username: string) {
  const result = await db('users').where('username', username).first()
  return !!result
}

export async function editUser(userData: User, userId: string) {
  const result = await db('users').where('authId', userId).update(userData)
  return result
}
