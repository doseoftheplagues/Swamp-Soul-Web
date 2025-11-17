import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { User } from '../../models/user'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const { data } = useUser()

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }

  return isAuthenticated && user ? (
    <div>
      <p>{data?.username}</p>
      <p>{data?.bio}</p>
      <p>Status: {data?.status}</p>
      <p>{user.email}</p>
    </div>
  ) : null
}

export default Profile
