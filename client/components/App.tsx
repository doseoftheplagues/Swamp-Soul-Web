import { Outlet } from 'react-router'
import Header from './Header.tsx'
import { useUser } from '../hooks/useUsers.ts'

import { LoadingSpinner } from './SmallerComponents/LoadingSpinner.tsx'

function App() {
  const { isLoading } = useUser()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="">
      <div>
        <Header />
      </div>
      <div className="sm:p-2">
        <Outlet />
      </div>
    </div>
  )
}

export default App
