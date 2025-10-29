import { useEffect, useState } from 'react'
import { Gig, gigsData } from '../../data/shows'
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
    <div className="flex-1">
      <div className="flex w-screen justify-center">
        <div className="flex-col size-11/12 justify-center sm:flex-row">
          <div className="size-">
            <img
              className="w-2 sm:w-140"
              src={'/posters/' + firstPoster.image}
              alt={firstPoster.image}
            ></img>
          </div>

          <div className="text-3xl/normal w-6/6 p-3">
            <p>{currentGig.date}</p>
            <p>{currentGig.location}</p>
            <p>{currentGig.performers}</p>
            <p>Poster by {firstPoster.designer}</p>
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
