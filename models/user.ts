export interface UserData {
  username: string
  bio: string
  status: string
  email: string
  admin: boolean
}

export interface User extends UserData {
  authId: string
}
