import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router'
import * as API from '../apis/users'

export function Register() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const { add, ...userDb } = useUser()
  const [userNameIsTaken, setUsernameIsTaken] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    status: '',
    email: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    if (userDb.data) navigate('/')
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await API.checkUsernameTaken(formData.username)
      if (response.isTaken) {
        setUsernameIsTaken(true)
        return
      }
      const token = await getAccessTokenSilently()
      await add.mutateAsync({ newUser: formData, token })
      setUsernameIsTaken(false)
      navigate('/profile')
    } catch (error) {
      console.error('Failed to create user or get access token:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (userDb.isLoading) {
    return <p>Checking authentication</p>
  }

  if (isAuthenticated) {
    return (
      <div>
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
          <input type="submit" className="submitButton" value="Submit" />
        </form>
      </div>
    )
  } else {
    return (
      <div>
        <p>Loading registration page...</p>
      </div>
    )
  }
}
