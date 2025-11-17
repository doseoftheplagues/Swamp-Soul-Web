import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router'

export function Register() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const { add, ...userDb } = useUser()
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
      const token = await getAccessTokenSilently()
      add.mutate({ newUser: formData, token })
    } catch (error) {
      console.error('Failed to get access token:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (userDb.isLoading){
    return <p>Checking authentication</p>
  }

  if (isAuthenticated) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
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
        <p>Meow!!</p>
      </div>
    )
  }
}
