export interface UserData {
  username: string
  bio: string
  status: string
  email: string
}

export interface User extends UserData {
  authId: string
}
