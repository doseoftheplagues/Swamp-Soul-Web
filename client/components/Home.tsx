import { Link } from 'react-router'

function Home() {
  return (
    <div className="p-4">
      <Link to="/archive">Archive</Link>
      <br></br>
      <Link to="/upcomingshows">Upcoming Shows</Link>
    </div>
  )
}

export default Home
