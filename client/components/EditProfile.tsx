import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'
import * as Form from '@radix-ui/react-form'

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
        <Form.Root onSubmit={handleSubmit}>
          {userNameIsTaken && <p>That username is already taken</p>}
          <Form.Field name="username">
            <div>
              <Form.Label>Username</Form.Label>
              <br />
              <Form.Message match="valueMissing">
                Please enter your username
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="w-90"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <br />
          <Form.Field name="bio">
            <div>
              <Form.Label>Bio</Form.Label>
              <br />
              <Form.Message match="valueMissing">
                Please enter your bio
              </Form.Message>
            </div>
            <Form.Control asChild>
              <textarea
                className="w-90"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <br />
          <Form.Field name="status">
            <div>
              <Form.Label>Status</Form.Label>
              <br />
              <Form.Message match="valueMissing">
                Please enter your status
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="w-90"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>
          <br />
          <Form.Submit asChild>
            <button
              className="submitButton"
              disabled={
                update.isPending ||
                !formData.username ||
                !formData.bio ||
                !formData.status
              }
            >
              {update.isPending ? 'Updating...' : 'Submit'}
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    )
  } else {
    return <p>Log in to edit profile</p>
  }
}

export default EditProfile
