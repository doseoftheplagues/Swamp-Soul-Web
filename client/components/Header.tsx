import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router'
import { useUser } from '../hooks/useUsers'

function Header() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()
  const { data } = useUser()

  const handleSignIn = () => {
    console.log('sign in')
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: `${window.location.origin}/register`,
      },
    })
  }

  const LoginButton = () => {
    return (
      <button onClick={handleSignIn} className="loginButton">
        Log In
      </button>
    )
  }
  if (!isAuthenticated) {
    return (
      <div className="flex w-screen flex-row p-2">
        <div className="flex w-1/2">
          <h1>
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h1>
        </div>
        <div className="flex w-1/2 justify-end">
          <LoginButton />
        </div>
      </div>
    )
  }
  if (isAuthenticated && !data) {
    return (
      <div className="flex w-screen flex-row p-2">
        <div className="flex w-1/2">
          <h1>
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h1>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex w-screen flex-row p-2">
        <div className="flex w-1/2">
          <h3>
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h3>
        </div>
        <div className="flex w-1/2 justify-end">
          <Link to={'/profile'}>Profile</Link>
        </div>
      </div>
    )
  }
}

export default Header
