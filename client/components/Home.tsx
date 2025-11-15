import { Link } from 'react-router'

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/archive">Archive</Link>
      <br></br>
      <Link to="/showuploadform">Show Upload Form</Link>
      <br></br>
      <Link to="/upcomingshows">Upcoming Shows</Link>
      <p>Yuuuup</p>
    </div>
  )
}

export default Home
