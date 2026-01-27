import { Link } from 'react-router'

function Home() {
  return (
    <div className="min-h-full w-full p-0">
      <div className="">
        <div className="absolute top-0 left-0 -z-10 min-h-screen w-screen overflow-hidden object-cover">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              width: '100%',
              objectFit: 'cover',
              zIndex: -1,
            }}
            className="h-screen w-screen brightness-50"
            poster="https://ik.imagekit.io/wosr5xwjlx/9389CCCB-C098-4412-9919-2C925616BE6E.jpeg"
          >
            <source
              src="https://ik.imagekit.io/wosr5xwjlx/backgrnd.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div className="mt-48 flex flex-col items-center">
          <img
            src="/gifs/logoCream.gif"
            alt="swamp soul logo gif cream"
            className="inset-0 mx-auto w-full sm:w-4/5"
          ></img>
          <p className="relative -top-2 text-[clamp(2rem,5vw,3.5rem)] text-[#faf8f1]">
            Noise / Pop / Love
          </p>

          <Link
            to="/upcomingshows"
            className="font-gemini cursor-pointer text-[clamp(2rem,5vw,3.5rem)] text-[#faf8f1]"
          >
            Upcoming Shows
          </Link>
          <div className="my-40 h-200 w-200 max-w-screen bg-[#faf8f1]">
            <p className="p-10 text-sm wrap-anywhere sm:text-base">
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon vv more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon v more stuff here soon v
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon vv
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon v more stuff here soon v more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon vv more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon v
              more stuff here soon v more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon vv more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon more stuff here soon
              more stuff here soon more stuff here soon v more stuff here soon v
              more stuff
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
