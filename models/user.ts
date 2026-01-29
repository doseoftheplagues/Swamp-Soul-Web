export interface UserData {
  username: string
  bio: string
  status: string
  email: string
  admin: boolean
  profilePicture: string
  blebsFound: number
  profileColorOne: string
  profileColorTwo: string
}

export interface User extends UserData {
  authId: string
}
