import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'
import * as Form from '@radix-ui/react-form'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'

interface EditProfileProps {
  setEditDetailsIsHidden: (isHidden: boolean) => void
}

const EditProfile = ({ setEditDetailsIsHidden }: EditProfileProps) => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { update, ...userDb } = useUser()
  const [userNameIsTaken, setUsernameIsTaken] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    status: '',
    email: '',
    profilePicture: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (!userDb.isLoading && !userDb.data) {
      navigate('/register')
    }
  }, [userDb.isLoading, userDb.data, navigate])

  useEffect(() => {
    if (user && userDb.data && user.email) {
      setFormData({
        username: userDb.data.username,
        bio: userDb.data.bio,
        status: userDb.data.status,
        email: user.email,
        profilePicture: userDb.data.profilePicture,
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
      update.mutate(
        {
          id: userId,
          updatedUser: formData,
          token,
        },
        {
          onSuccess: () => {
            setUsernameIsTaken(false)
            setEditDetailsIsHidden(true)
          },
        },
      )
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
    return (
      <div className="">
        <LoadingSpinner />
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md p-2">
        <h2 className="text-md mb-2">Edit Details</h2>
        <Form.Root onSubmit={handleSubmit}>
          {userNameIsTaken && <p>That username is already taken</p>}
          <Form.Field name="username">
            <div className="">
              <Form.Label className="block text-sm font-medium">
                Username
              </Form.Label>
              <Form.Message match="valueMissing">
                Please enter your username
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="mb-2 w-full p-1 text-sm"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="bio">
            <div>
              <Form.Label className="block text-sm font-medium">Bio</Form.Label>
              <Form.Message match="valueMissing">
                Please enter your bio
              </Form.Message>
            </div>
            <Form.Control asChild>
              <textarea
                className="w-full p-1 text-sm"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Field name="status">
            <div>
              <Form.Label className="text-sm">Status</Form.Label>
              <br />
              <Form.Message match="valueMissing">
                Please enter your status
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                className="w-full p-1 text-sm"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button
              className="mt-2 inline-flex justify-center rounded-md border-2 border-black bg-[#ead2d2be] px-2 py-1 text-sm font-medium text-black hover:bg-[#e1bebef5] focus:ring-offset-2 focus:outline-none active:bg-[#e1bebe] disabled:cursor-not-allowed disabled:opacity-50"
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
