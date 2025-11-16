// import { useFruits } from '../hooks/useFruits.ts'

import { Outlet } from 'react-router'
import Header from './Header.tsx'

function App() {
  // const { data } = useFruits()

  return (
    <div className="">
      <Header />
      <Outlet />
    </div>
  )
}

export default App
