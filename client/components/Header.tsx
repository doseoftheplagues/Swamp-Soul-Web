import { useAuth0 } from '@auth0/auth0-react'
import { Link, useLocation } from 'react-router-dom'
import LoginButton from './SmallerComponents/LoginButton'
import { useUserById } from '../hooks/useUsers'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function getDisplayPathname(pathname: string): string {
  const parts = pathname.split('/')
  if (parts.length > 2 && !isNaN(Number(parts[2]))) {
    return `/${parts[1]}`
  }
  return pathname
}

interface HeaderProps {
  scrolled: boolean
}

function Header({ scrolled }: HeaderProps) {
  const { user, isAuthenticated } = useAuth0()
  const location = useLocation()
  const pathParts = location.pathname.split('/')
  const isUserProfilePage = pathParts[1] === 'user' && pathParts[2]
  const userId = isUserProfilePage ? pathParts[2] : ''

  const { data: profileUser, isLoading: isProfileUserLoading } =
    useUserById(userId)

  const tl = useRef<gsap.core.Timeline>()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useGSAP(
    () => {
      if (!menuRef.current) return

      gsap.set(menuRef.current, { autoAlpha: 0 })

      tl.current = gsap
        .timeline({ paused: true })
        .to(menuRef.current, { autoAlpha: 1, duration: 0.2 })
        .from('.menu-item', {
          opacity: 0,
          y: -10,
          stagger: 0.07,
          duration: 0.07,
        })
    },
    { scope: menuRef, dependencies: [isAuthenticated] },
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        if (tl.current && !tl.current.reversed()) {
          tl.current.reverse()
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef, buttonRef, tl])

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

  function handleDropdownClick() {
    if (tl.current) {
      tl.current.reversed() ? tl.current.play() : tl.current.reverse()
    }
  }

  if (location.pathname !== '/register') {
    return (
      <div>
        <div
          className={`flex w-screen flex-row py-1 text-sm sm:text-lg ${
            location.pathname !== '/'
              ? 'bg-[#faf8f1]'
              : `${scrolled == true ? 'bg-[#faf8f1] text-black' : 'bg-transparent text-[#faf8f1]'} `
          }`}
        >
          <div className="relative flex w-3/4 flex-row sm:w-1/2">
            <div className="absolute top-0 left-0">
              <button
                ref={buttonRef}
                className="cursor-pointer pl-2"
                onClick={() => handleDropdownClick()}
              >
                Swamp Soul
              </button>
              <div
                ref={menuRef}
                className={`${location.pathname !== '/' ? `border-2 border-[#dad7c282] bg-[#faf8f1] text-black` : `${scrolled ? 'border-2 border-[#dad7c282] bg-[#faf8f1] text-black' : 'bg-transparent text-[#faf8f1]'}`} mt-1 rounded-br-sm`}
              >
                <ul className="px-2 py-1">
                  <li className="menu-item">
                    <Link to={'/'}>Home</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={'/upcomingshows'}>Upcoming Shows</Link>
                  </li>
                  <li className="menu-item">
                    <Link to={'/newreleases'}>New Releases</Link>
                  </li>

                  <li className="menu-item">
                    <Link to={'/footage'}>Footage</Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="-z-40 pr-1 pl-2 opacity-0">Swamp soul</p>
            <div className="">{location.pathname !== '/' && breadcrumb}</div>
          </div>
          <div className="flex w-1/4 justify-end px-2 sm:w-1/2">
            {!isAuthenticated && <LoginButton classes={''} />}
            {isAuthenticated && location.pathname !== '/profile' && (
              <Link to={'/profile'} className="cursor-pointer">
                Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Header
