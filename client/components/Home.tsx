import { Link } from 'react-router'
import { PosterUploader } from './SmallerComponents/PosterUploader'

function Home() {
  function placeholder() {
    console.log('meow')
  }
  return (
    <div className="p-4">
      <Link to="/archive">Archive</Link>
      <br></br>
      <Link to="/showuploadform">Show Upload Form</Link>
      <br></br>
      <Link to="/upcomingshows">Upcoming Shows</Link>
      <br />
      <PosterUploader uploadSuccess={placeholder} />
    </div>
  )
}

export default Home
