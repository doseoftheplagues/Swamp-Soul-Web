import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router'
import { useUser } from '../hooks/useUsers'

function Header() {
  const {
    isAuthenticated,

    loginWithRedirect,
  } = useAuth0()
  const location = useLocation()
  const { data } = useUser()

  const handleSignIn = () => {
    console.log('--- handleSignIn called ---')
    console.log('window.location.origin:', window.location.origin)
    console.log('window.location.origin')
    const redirectUri = `${window.location.origin}/register`
    console.log('redirect_uri being used:', redirectUri)
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: redirectUri,

        prompt: 'login',
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
        <div className="flex w-3/4 sm:w-1/2">
          <h1 className="text-swamp-green-300">
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h1>
        </div>
        <div className="flex w-1/4 justify-end sm:w-1/2">
          <LoginButton />
        </div>
      </div>
    )
  } else if (isAuthenticated && location.pathname == '/profile') {
    return (
      <div className="flex w-screen flex-row p-2">
        <div className="flex w-3/4 sm:w-1/2">
          <h3 className="text-swamp-green-300">
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h3>
          <div></div>
        </div>
        <div className="flex w-1/4 justify-end sm:w-1/2"></div>
      </div>
    )
  } else {
    return (
      <div className="flex w-screen flex-row p-2">
        <div className="flex w-3/4 sm:w-1/2">
          <h3 className="text-swamp-green-300">
            <Link to={'/'}>Swamp Soul </Link> {location.pathname}
          </h3>
        </div>
        <div className="flex w-1/4 justify-end sm:w-1/2">
          <Link to={'/profile'}>Profile</Link>
        </div>
      </div>
    )
  }
}

export default Header
