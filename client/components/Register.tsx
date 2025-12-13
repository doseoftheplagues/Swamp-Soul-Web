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
      <div className="mx-auto max-w-md p-4">
        <Form.Root className="FormRoot" onSubmit={handleSubmit}>
          {userNameIsTaken && (
            <p className="error-message">That username is already taken</p>
          )}
          <Form.Field className="FormField" name="username">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Form.Label className="FormLabel">Username</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Username is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                name="username"
                className="Input"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="FormField" name="bio">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Form.Label className="FormLabel">Bio</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Bio is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <textarea
                name="bio"
                className="Textarea"
                required
                value={formData.bio}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Field className="FormField" name="status">
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <Form.Label className="FormLabel">Status</Form.Label>
              <Form.Message className="FormMessage" match="valueMissing">
                Status is required
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                name="status"
                className="Input"
                type="text"
                required
                value={formData.status}
                onChange={handleChange}
              />
            </Form.Control>
          </Form.Field>

          <Form.Submit asChild>
            <button className="Button submitButton" style={{ marginTop: 10 }}>
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
