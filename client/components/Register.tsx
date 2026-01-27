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
    profilePicture: '/assets/default.jpeg',
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
      <div className="-mt-20 flex h-screen items-center justify-center p-5">
        <div className="mt-10 h-fit w-full rounded-lg border-2 bg-[#dad8cb53] text-left md:w-88">
          <div className="rounded-t-md border-b-[1.5px] border-b-[#0202025f] bg-[#dad8cb] px-1.5 py-1">
            Register your account
          </div>
          <div className="p-4">
            <Form.Root className="FormRoot" onSubmit={handleSubmit}>
              {userNameIsTaken && (
                <p className="error-message">That username is already taken</p>
              )}
              <Form.Field className="FormField" name="username">
                <div>
                  <Form.Label className="FormLabel">Username</Form.Label>
                  <br />
                  <Form.Message
                    className="FormMessage text-sm text-red-500"
                    match="valueMissing"
                  >
                    Username is required
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <input
                    className="mb-1.5 w-full rounded-xs p-1"
                    name="username"
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
                </div>
                <Form.Control asChild>
                  <textarea
                    name="bio"
                    className="w-full rounded-xs p-1"
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
                </div>
                <Form.Control asChild>
                  <input
                    name="status"
                    className="w-full rounded-xs p-1"
                    type="text"
                    maxLength={8}
                    required
                    value={formData.status}
                    onChange={handleChange}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Submit asChild>
                <div className="flex justify-end">
                  <button className="mt-4 flex cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] bg-[#dad7c2c1] px-1.5 py-1 text-sm hover:bg-[#eae8dc] active:bg-[#c1bd9a] disabled:cursor-not-allowed disabled:opacity-50">
                    Submit
                  </button>
                </div>
              </Form.Submit>
            </Form.Root>
          </div>
        </div>
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
