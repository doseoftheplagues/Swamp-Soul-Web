import { Outlet } from 'react-router'
import Header from './Header.tsx'
import { useUser } from '../hooks/useUsers.ts'

import { LoadingSpinner } from './SmallerComponents/LoadingSpinner.tsx'
import { useEffect, useState } from 'react'

function App() {
  const { isLoading } = useUser()
  const [scrolled, setScrolled] = useState(false)

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

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="">
      <div
        className={`sticky top-0 z-2000 ${scrolled ? 'border-b-2 border-b-[#dad7c282]' : 'border-0'}`}
      >
        <Header />
      </div>
      <div className="sm:p-2">
        <Outlet />
      </div>
    </div>
  )
}

export default App
