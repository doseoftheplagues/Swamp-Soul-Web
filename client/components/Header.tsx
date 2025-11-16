import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router'

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    return (
      <button onClick={() => loginWithRedirect()} className="loginButton">
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
