import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'
import * as Form from '@radix-ui/react-form'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { FileUploader } from './SmallerComponents/FileUploader'

const EditProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { update, ...userDb } = useUser()
  const [userNameIsTaken, setUsernameIsTaken] = useState(false)
  const [newProfilePicture, setNewProfilePicture] = useState<string>()
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    status: '',
    email: '',
    profilePicture: newProfilePicture,
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (!userDb.isLoading && !userDb.data) {
      navigate('/register')
    }
  }, [userDb.isLoading, userDb.data, navigate])

  useEffect(() => {
    if (user && userDb.data) {
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
    return (
      <div className="">
        <LoadingSpinner />
      </div>
    )
  }

  const handleImageUrlReceived = async (url: string) => {
    try {
      console.log('Image uploaded successfully! URL:', url)
      setNewProfilePicture(url)
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  if (isAuthenticated) {
    return (
      <div className="mx-auto max-w-md p-4">
        <h2 className="mb-2 text-xl">Edit Profile</h2>
        <Form.Root onSubmit={handleSubmit}>
          {userNameIsTaken && <p>That username is already taken</p>}
          <Form.Field name="username">
            <div>
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
                className="w-full p-1 text-sm"
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
                className="w-full p-1"
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
                className="w-full p-1"
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
              className="text-md mt-6 inline-flex w-full justify-center rounded-md border-2 border-black bg-[#dad7c2] px-4 py-2 font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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

// <div>
//   <label htmlFor="about" className="block text-sm font-medium">
//     About
//   </label>
//   <div className="mt-1">
//     <textarea
//       id="about"
//       name="about"
//       rows={3}
//       className="mt-1 block w-full rounded-md border p-2 shadow-sm sm:text-sm"
//       placeholder="you@example.com"
//     ></textarea>
//   </div>
//   <p className="mt-2 text-sm text-gray-500">
//     Brief description for your profile. URLs are hyperlinked.
//   </p>
// </div>

{
  /* <Form.Field name="profilePicture">
            <Form.Label className="block text-sm font-medium">
              Add profile picture
            </Form.Label>
            <Form.Control asChild>
              <FileUploader uploadSuccess={handleImageUrlReceived} />
            </Form.Control>
          </Form.Field> */
}
