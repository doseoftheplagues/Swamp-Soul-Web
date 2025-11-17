import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router'

export function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { isAuthenticated } = useAuth0()
  const user = useUser()
  const [formData, setFormData] = useState({
    username: '',
  })

  const handleMutationSuccess = () => {
    setErrorMsg('')
  }
  const handleError = (error: unknown) => {
    if (error instanceof Error) {
      setErrorMsg(error.message)
    } else setErrorMsg('Unknown error')
  }

  const mutationOptions = {
    onSuccess: handleMutationSuccess,
    onError: handleError,
  }
  const navigate = useNavigate()

  useEffect(() => {
    if (user.data) navigate('/')
  }, [user.data, navigate])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  if (isAuthenticated) {
    return (
      <div>
        <form onSubmit={console.log('meow')}>
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
            value={formData.username}
            onChange={handleChange}
          ></textarea>
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
