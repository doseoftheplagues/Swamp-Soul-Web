export default function Videos() {
  const videos = [
    {
      title: 'COOK IE CUTT ER "trick her eey2" live 22/02/2025',
      link: 'https://www.youtube.com/embed/psB16zt5IrQ?si=vB7mYpt1zfmNeX9r',
    },
    {
      title: 'BUG MICHIGAN full set 06/07/2025',
      link: 'https://www.youtube.com/embed/trYcITXjXbc?si=f9xSfw6CEjIQ2_5F',
    },
    {
      title: 'MUDGOOSE full set 02/05/2025',
      link: 'https://www.youtube.com/embed/619ki6LVuT0?si=1b-EyLuxc9bfPJdS',
    },
    {
      title: 'COOK IE CUTT ER "Resplendence" live 19/10/2025',
      link: 'https://www.youtube.com/embed/uOwlO8h-N2Y?si=Hx1qXJ9AQkaGp5Q-',
    },
    {
      title: 'SCRAMBLE 204 full set 09/02/2025',
      link: 'https://www.youtube.com/embed/P34QpjvIy-k?si=URqftc1-dzO33_xc',
    },
    {
      title: 'JJOYCE live(clips) 09/02/2025',
      link: 'https://www.youtube.com/embed/TnZDEwc2UAk?si=4yrpYl6YeOeGwv49',
    },
    {
      title: 'SILICON TONGUE live(clips) 09/02/2025',
      link: 'https://www.youtube.com/embed/czoAvH2gpCk?si=GwCNeX4VbKfZKVBv',
    },
    {
      title: 'YANS SUPERMARKET full set 09/02/2025',
      link: 'https://www.youtube.com/embed/cUWGxnuz_jc?si=PTXqJ1XxIsXRVs6p',
    },
    {
      title: 'WESTERN HAIKUS // AMERICAN MUSCLE - LIVE 2/11/24',
      link: 'https://www.youtube.com/embed/Bk6w5SI0xxI?si=vsfAhj1pkgUyfADd',
    },
    {
      title: 'Plastic Double Ep Release 19/10/2024',
      link: 'https://www.youtube.com/embed/SJBBFtZquLI?si=go7RM_-qyMVWONda',
    },
    {
      title: 'PUPPY DRONE VISION full performance 13/04/2024',
      link: 'https://www.youtube-nocookie.com/embed/nPSD8BV-_is?si=rQQd8bxu0-n4B7XC&amp;controls=0',
    },
  ]

  return (
    <div className="min-h-[calc(100vh-15rem)] w-screen p-2">
      <div className="CONTENT flex w-full flex-col items-center justify-center">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative mb-8 flex flex-col justify-center"
          >
            <p className="relative top-1 left-0 mt-4 mb-4 text-justify text-2xl wrap-normal italic">
              {video.title}
            </p>
            <div className="aspect-video h-auto max-w-full sm:h-[200px] md:h-[400px] lg:h-[600px]">
              <iframe
                width="100%"
                height="100%"
                src={video.link}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
