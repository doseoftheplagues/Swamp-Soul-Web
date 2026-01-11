import { Link } from 'react-router'

function Home() {
  return (
    <div className="h-full w-full p-0">
      <Link to="/upcomingshows">Upcoming Shows</Link>\
      <img
        src="/gifs/logoGifBlack2.gif"
        alt="swamp soul logo gif black"
        className="absolute inset-0 m-auto w-4/5"
      ></img>
    </div>
  )
}

export default Home
