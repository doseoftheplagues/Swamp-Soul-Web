import { Outlet, useNavigate } from 'react-router'
import Header from './Header.tsx'

import { LoadingSpinner } from './SmallerComponents/LoadingSpinner.tsx'
import { useEffect, useState } from 'react'
import { Footer } from './Footer.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { useUserExists } from '../hooks/useUserExists.ts'

function App() {
  const { exists, isLoading } = useUserExists()
  const [scrolled, setScrolled] = useState(false)

  const { isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isAuthenticated && !isLoading && !exists) {
      navigate('/register')
    }
  }, [isAuthenticated, isLoading, exists, navigate])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="">
      <div
        className={`sticky top-0 z-2000 ${scrolled ? 'border-b-2 border-b-[#dad7c282]' : 'border-0'}`}
      >
        <Header scrolled={scrolled} />
      </div>
      <div className="min-h-[90%]">
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default App
