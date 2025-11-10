import { useAuth0 } from '@auth0/auth0-react'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }

  return isAuthenticated && user ? (
    <div>
      <h1>Meow</h1>
      <p>{user.email}</p>
      <p>{user.preferred_username}</p>
    </div>
  ) : null
}

export default Profile
