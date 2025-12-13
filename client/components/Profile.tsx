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
    <div className="p-4">
      <div className="flex flex-row">
        <p>{data?.username} </p>
        <p className="pl-5 italic opacity-80">{user.email}</p>
        {data?.admin && <p className="pl-5">Admin</p>}
      </div>
      <p className="text-sm">Bio</p>
      <p>{data?.bio}</p>

      <p>Status: {data?.status}</p>
      <button className="mt-1 inline-flex justify-center rounded-sm border border-black bg-[#dad7c2] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none">
        <Link to={'/editprofile'}>Edit details</Link>
      </button>
    </div>
  ) : null
}

export default Profile
