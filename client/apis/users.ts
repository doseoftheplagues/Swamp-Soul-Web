import request from 'superagent'
import { User, UserData } from '../../models/user'

const rootURL = new URL(`/api/v1`, document.baseURI)

interface GetUserFunction {
  token: string
}

export async function getUser({
  token,
}: GetUserFunction): Promise<User | null> {
  return await request
    .get(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .then((res) => (res.body.user ? res.body.user : null))
    .catch((err) => {
      console.error(err)
      throw err
    })
}

interface AddUserFunction {
  newUser: UserData
  token: string
}

export async function addUser({
  newUser,
  token,
}: AddUserFunction): Promise<User> {
  return request
    .post(`${rootURL}/users`)
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
    .then((res) => res.body.user)
    .catch((err) => {
      console.error(err)
      throw err
    })
}

interface EditUserTemp {
  username: string
  bio: string
  status: string
  email: string
  profilePicture: string
}

interface EditUserFunction {
  id: string
  updatedUser: Partial<EditUserTemp>
  token: string
}

export async function editUser({
  id,
  updatedUser,
  token,
}: EditUserFunction): Promise<Partial<EditUserTemp>> {
  return request
    .patch(`${rootURL}/users/edit-user/${id}`)
    .send(updatedUser)
    .set('Authorization', `Bearer ${token}`)
    .catch((err) => {
      console.error(err)
      throw err
    })
}

export async function checkUsernameTaken(username: string) {
  const response = await request
    .get(`${rootURL}/users/check-username/${username}`)
    .catch((err) => {
      console.error(err)
      throw err
    })

  return response.body
}
