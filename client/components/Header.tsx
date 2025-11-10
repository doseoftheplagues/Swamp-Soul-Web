import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router'

function Header() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  const LoginButton = () => {
    const { loginWithRedirect } = useAuth0()
    return (
      <button onClick={() => loginWithRedirect()} className="loginButton ">
        Log In
      </button>
    )
  }
  if (!isAuthenticated) {
    return (
      <div className="w-screen p-2 flex flex-row">
        <div className="flex w-1/2">
          <h3>Swamp Soul</h3>
        </div>
        <div className="flex w-1/2 justify-end">
          <LoginButton />
        </div>
      </div>
    )
  } else {
    return (
      <div className="w-screen p-2 flex flex-row">
        <div className="flex w-1/2">
          <h3>Swamp Soul</h3>
        </div>
        <div className="flex w-1/2 justify-end">
          <Link to={'/profile'}>Profile</Link>
        </div>
      </div>
    )
  }
}

export default Header
