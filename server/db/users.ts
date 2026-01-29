import connection from './connection.ts'
import { User, UserData } from '../../models/user.ts'

const db = connection

const columns = [
  'authId',
  'username',
  'bio',
  'status',
  'email',
  'profile_picture as profilePicture',
  'admin',
  'blebs_found as blebsFound',
  'profile_color_one as profileColorOne',
  'profile_color_two as profileColorTwo',
]

export async function userExists(authId: string): Promise<boolean> {
  const user = await db('users').where('authId', authId).first()
  return !!user
}

export async function getUserById(id: string) {
  const result = await db('users').where('authId', id).select(columns).first()
  return result
}

export async function addUser(newUser: User): Promise<UserData[]> {
  const {
    profilePicture,
    blebsFound,
    profileColorOne,
    profileColorTwo,
    ...rest
  } = newUser
  const userToInsert = {
    ...rest,
    profile_picture: profilePicture,
    blebs_found: blebsFound,
    profile_color_one: profileColorOne,
    profile_color_two: profileColorTwo,
  }
  return db('users').insert(userToInsert).returning(columns)
}

export async function usernameTakenCheck(username: string) {
  const result = await db('users').where('username', username).first()
  return !!result
}

export async function editUser(userData: Partial<User>, userId: string) {
  const {
    profilePicture,
    blebsFound,
    profileColorOne,
    profileColorTwo,
    ...rest
  } = userData
  const userToUpdate: { [key: string]: string | boolean | number | undefined } = {
    ...rest,
  }

  if (profilePicture !== undefined) {
    userToUpdate.profile_picture = profilePicture
  }
  if (blebsFound !== undefined) {
    userToUpdate.blebs_found = blebsFound
  }
  if (profileColorOne !== undefined) {
    userToUpdate.profile_color_one = profileColorOne
  }
  if (profileColorTwo !== undefined) {
    userToUpdate.profile_color_two = profileColorTwo
  }

  const result = await db('users').where('authId', userId).update(userToUpdate)
  return result
}
