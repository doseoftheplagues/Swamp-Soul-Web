import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'

const EditProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { update, ...userDb } = useUser()
  const [userNameIsTaken, setUsernameIsTaken] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    status: '',
    email: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (user && userDb.data) {
      setFormData({
        username: userDb.data.username,
        bio: userDb.data.bio,
        status: userDb.data.status,
        email: user.email,
      })
    }
  }, [user, userDb.data])

  const userId = userDb.data?.authId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const originalUsername = userDb.data?.username
      if (originalUsername !== formData.username) {
        const response = await API.checkUsernameTaken(formData.username)
        if (response.isTaken) {
          setUsernameIsTaken(true)
          return
        }
      }
      const token = await getAccessTokenSilently()
      if (!userId) {
        console.error('Could not find user ID to update.')
        return
      }
      update.mutate({
        id: userId,
        updatedUser: formData,
        token,
      })
      setUsernameIsTaken(false)
      navigate('/profile')
    } catch (error) {
      console.error('Failed to get access token:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (userDb.isLoading) {
    return <p>Checking authentication</p>
  }

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }
  if (isAuthenticated) {
    return (
      <div>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {userNameIsTaken && <p>That username is already taken</p>}
          <label htmlFor="username">Username</label>
          <br></br>
          <input
            type="text"
            className="w-90"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          ></input>
          <br></br>
          <label htmlFor="bio">Bio</label>
          <br></br>
          <textarea
            className="w-90"
            rows={3}
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          ></textarea>
          <br></br>
          <label htmlFor="status">Status</label>
          <br></br>
          <input
            type="text"
            className="w-90"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          ></input>
          <br></br>
          <input
            type="submit"
            className="submitButton"
            value={update.isLoading ? 'Updating...' : 'Submit'}
            disabled={update.isLoading}
          />
        </form>
      </div>
    )
  }
}

export default EditProfile
