import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router'

function getDisplayPathname(pathname: string): string {
  const parts = pathname.split('/')
  if (parts.length > 2 && !isNaN(Number(parts[2]))) {
    return `/${parts[1]}`
  }
  return pathname
}

function Header() {
  const { isAuthenticated, loginWithRedirect } = useAuth0()
  const location = useLocation()
  const displayPath = getDisplayPathname(location.pathname)

  const handleSignIn = () => {
    const redirectUri = `${window.location.origin}/register`
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

  return (
    <div className="flex w-screen flex-row bg-[#faf8f1] p-1 text-sm sm:text-base">
      <div className="flex w-3/4 sm:w-1/2">
        <h1 className="">
          <Link to={'/'}> Swamp Soul </Link>
          {displayPath !== '/' && <Link to={displayPath}> {displayPath}</Link>}
        </h1>
      </div>
      <div className="flex w-1/4 justify-end sm:w-1/2">
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && displayPath != '/profile' && (
          <Link to={'/profile'}>Profile</Link>
        )}
      </div>
    </div>
  )
}

export default Header
