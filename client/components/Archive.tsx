import { useEffect, useState } from 'react'
import { useShows } from '../hooks/useShows'
import showArchiveInfo from './ArchiveInfo'
import SearchBar from './SmallerComponents/SearchBar'

function Archive() {
  const [currentGigIndex, setCurrentGigIndex] = useState(0)
  const [showingInfo, setShowingInfo] = useState(false)
  const { shows, isLoading, isError, error } = useShows()

  useEffect(() => {
    if (showingInfo) {
      window.scrollTo({
        top: 800,
        left: 0,
        behavior: 'smooth',
      })
    }
  }, [showingInfo])

  if (isLoading) return <h2>Is Loading...</h2>

  if (isError) return <h2>{String(error)}</h2>

  if (!shows || shows.length === 0) return <div>No shows found.</div>

  const currentGig = shows[currentGigIndex]

  if (!currentGig) return <div>Could not find the selected show.</div>

  const displayButton = currentGig.posters.length > 0

  function handleNext() {
    if (currentGigIndex == shows.length - 1) {
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

  const firstPoster = currentGig.posters[0]

  return (
    <div className="w-screen">
      <SearchBar />
      <div className="flex w-full justify-center">
        <div className="flex w-screen flex-col justify-center sm:flex-row">
          <div className="flex align-middle">
            <img
              className="sm:object-fit sm:h-180"
              src={'/posters/' + firstPoster.image}
              alt={'archive poster'}
            ></img>
          </div>

          <div className="text-pre flex w-screen items-center p-3 text-left sm:w-100">
            <p className="hidden whitespace-pre-line sm:block">
              {currentGig.location} <br></br>
              {currentGig.date}
              <br></br>
              {currentGig.performers}
              <br></br>
              Poster design by {firstPoster.designer}
            </p>
            <p className="block sm:hidden">
              Poster design by {firstPoster.designer}
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

export { Archive }
