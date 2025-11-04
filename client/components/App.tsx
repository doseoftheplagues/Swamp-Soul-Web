// import { useFruits } from '../hooks/useFruits.ts'

import { Outlet } from 'react-router'

function App() {
  // const { data } = useFruits()

  return (
    // <>
    //   <div className="app">
    //     <h1>Fullstack Boilerplate - with Fruits!</h1>
    //     <ul>{data && data.map((fruit) => <li key={fruit}>{fruit}</li>)}</ul>
    //   </div>
    // </>
    <div className="w-screen">
      <h3>Swamp Soul</h3>
      <Outlet />
    </div>
  )
}

export default App
