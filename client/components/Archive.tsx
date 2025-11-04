import { useEffect, useState } from 'react'
import { gigsData } from '../../data/shows'
import showArchiveInfo from './ArchiveInfo'

function Archive() {
  const [currentGigIndex, setCurrentGigIndex] = useState(0)
  const [showingInfo, setShowingInfo] = useState(false)
  const [displayButton, setDisplayButton] = useState(false)
  const currentGig = gigsData[currentGigIndex]
  const firstPoster = currentGig.posters[0]

  useEffect(() => {
    if (currentGig.posters[1]) {
      setDisplayButton(true)
    } else {
      setDisplayButton(false)
    }
    ;[currentGig]
  })

  useEffect(() => {
    if (showingInfo) {
      window.scrollTo({
        top: 800,
        left: 0,
        behavior: 'smooth',
      })
    }
  }, [showingInfo])

  function handleNext() {
    if (currentGigIndex == gigsData.length - 1) {
      setCurrentGigIndex(0)
      setShowingInfo(false)
    } else {
      setCurrentGigIndex(currentGigIndex + 1)
      setShowingInfo(false)
    }
  }

  function handleDown() {
    setShowingInfo(true)
  }

  return (
    <div className="w-screen">
      <div className="flex w-full justify-center ">
        <div className=" flex flex-col sm:flex-row w-screen justify-center">
          <div className="flex align-middle">
            <img
              className=" sm:h-180 sm:object-fit"
              src={'/posters/' + firstPoster.image}
              alt={firstPoster.image}
            ></img>
          </div>

          <div className="flex items-center text-left text-pre w-screen sm:w-100  p-3">
            <p className="hidden sm:block whitespace-pre-line">
              {currentGig.location} <br></br>
              {currentGig.date}
              <br></br>
              {currentGig.performers}
              <br></br>
              Designed by {firstPoster.designer}
            </p>
            <p className="block sm:hidden">
              Designed by {firstPoster.designer}
            </p>
          </div>
        </div>
      </div>
      <div className="buttonFooter">
        <div className="buttonColumn">
          <button onClick={handleNext}>←</button>
        </div>
        {displayButton == true && (
          <div className="buttonColumn">
            <button onClick={handleDown}>↓</button>
          </div>
        )}
        <div className="buttonColumn">
          <button onClick={handleNext}>→</button>
        </div>
      </div>
      {showingInfo === true && showArchiveInfo(currentGigIndex)}
    </div>
  )
}
//
export { Archive }
