import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'
import LoginButton from './SmallerComponents/LoginButton'
import { useUserById } from '../hooks/useUsers'

function getDisplayPathname(pathname: string): string {
  const parts = pathname.split('/')
  if (parts.length > 2 && !isNaN(Number(parts[2]))) {
    return `/${parts[1]}`
  }
  return pathname
}

function Header() {
  const { user, isAuthenticated } = useAuth0()
  const location = useLocation()
  const pathParts = location.pathname.split('/')
  const isUserProfilePage = pathParts[1] === 'user' && pathParts[2]
  const userId = isUserProfilePage ? pathParts[2] : ''

  const { data: profileUser, isLoading: isProfileUserLoading } =
    useUserById(userId)

  let breadcrumb

  if (isUserProfilePage) {
    if (isProfileUserLoading) {
      breadcrumb = <span> / User Profile</span>
    } else if (profileUser) {
      if (isAuthenticated && profileUser.authId === user?.sub) {
        breadcrumb = <Link to={'/profile'}> / {profileUser.username}</Link>
      } else {
        breadcrumb = (
          <Link to={`/user/${userId}`}> / {profileUser.username}</Link>
        )
      }
    } else {
      breadcrumb = <span> / User Profile</span>
    }
  } else {
    const displayPath = getDisplayPathname(location.pathname)
    if (displayPath !== '/') {
      breadcrumb = <Link to={displayPath}> {displayPath}</Link>
    }
  }
  if (location.pathname !== '/register') {
    return (
      <div
        className={`flex w-screen flex-row px-2 py-1 text-sm sm:text-lg ${
          location.pathname !== '/'
            ? 'bg-[#faf8f1]'
            : 'bg-transparent text-[#faf8f1]'
        }`}
      >
        <div className="flex w-3/4 sm:w-1/2">
          <h1 className="HeaderAddress">
            <Link to={'/'} className="">
              Swamp Soul
            </Link>
            {location.pathname !== '/' && breadcrumb}
          </h1>
        </div>
        <div className="flex w-1/4 justify-end sm:w-1/2">
          {!isAuthenticated && <LoginButton classes={''} />}
          {isAuthenticated && location.pathname !== '/profile' && (
            <Link to={'/profile'} className="cursor-pointer">
              Profile
            </Link>
          )}
        </div>
      </div>
    )
  }
}

export default Header
