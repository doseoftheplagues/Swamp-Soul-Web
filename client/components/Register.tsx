import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'
import * as Form from '@radix-ui/react-form'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'

export function Register() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const { add, ...userDb } = useUser()
  const navigate = useNavigate()

  const [userNameIsTaken, setUsernameIsTaken] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    status: '',
    email: '',
    admin: false,
    profilePicture: 'Public/assets/default.jpeg',
  })

  useEffect(() => {
    if (userDb.data) {
      navigate('/')
    }
  }, [userDb.data, navigate])

  useEffect(() => {
    const emailFromAuth0 = user?.email
    if (emailFromAuth0) {
      setFormData((currentData) => ({
        ...currentData,
        email: emailFromAuth0,
      }))
    }
  }, [user])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await API.checkUsernameTaken(formData.username)
      if (response.isTaken) {
        setUsernameIsTaken(true)
        return
      }
      setUsernameIsTaken(false)
      const token = await getAccessTokenSilently()
      await add.mutateAsync({ newUser: formData, token })
      navigate('/profile')
    } catch (error) {
      console.error('Failed to create user or get access token:', error)
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
    return <p>Checking authentication...</p>
  }

  if (isAuthenticated) {
    return (
      <div className="mx-auto my-auto max-w-fit rounded-lg bg-[#dbdad4] p-4 text-left">
        <Form.Root className="FormRoot" onSubmit={handleSubmit}>
          {userNameIsTaken && (
            <p className="error-message">That username is already taken</p>
          )}
          <Form.Field className="FormField" name="username">
            <div>
              <Form.Label className="FormLabel">Username</Form.Label>
              <br />
              <Form.Message
                className="FormMessage text-sm"
                match="valueMissing"
              >
                Username is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                name="username"
                className="w-sm p-1"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="FormField" name="bio">
            <div>
              <Form.Label className="FormLabel">Bio</Form.Label>
              <br />
              <Form.Message
                className="FormMessage text-sm"
                match="valueMissing"
              >
                Bio is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <textarea
                name="bio"
                className="w-sm p-1"
                required
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="FormField" name="status">
            <div>
              <Form.Label className="FormLabel">Status</Form.Label>
              <br></br>
              <Form.Message
                className="FormMessage text-sm"
                match="valueMissing"
              >
                Status is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                name="status"
                className="w-sm p-1"
                type="text"
                required
                value={formData.status}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button className="mt-6 inline-flex justify-center rounded-md border border-transparent bg-[#dad7c2] px-4 py-2 text-sm font-medium text-[#000000] shadow-sm focus:border-[#d1d5c7] focus:bg-[#c1bd9a] focus:ring-[#8f9779] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              Submit
            </button>
          </Form.Submit>
        </Form.Root>
      </div>
    )
  } else {
    return (
      <div>
        <LoadingSpinner />
      </div>
    )
  }
}
