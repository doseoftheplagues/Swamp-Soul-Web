import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router'

export function Register() {
  const [errorMsg, setErrorMsg] = useState('')
  const { getAccessTokenSilently } = useAuth0()
  const user = useUser()

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

  return (
    <div>
      <p>Meow!!</p>
    </div>
  )
}
