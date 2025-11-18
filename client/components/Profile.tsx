import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { Link } from 'react-router'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const { data } = useUser()

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }
  if (!isAuthenticated) {
    return <p>Log in to view your profile</p>
  }
  return isAuthenticated && user ? (
    <div>
      <p>{data?.username}</p>
      <p>{data?.bio}</p>
      <p>Status: {data?.status}</p>
      <p>{user.email}</p>
      <Link to={'/editprofile'}>Edit details</Link>
    </div>
  ) : null
}

export default Profile
