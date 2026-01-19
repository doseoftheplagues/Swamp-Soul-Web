import { gigsData } from '../../data/shows'

// archive info process
// conditionally render poster variants
// conditionally render media div, image div and anecdotes div
// else display nothing here yet ui

export default function showArchiveInfo(currentGigIndex: number) {
  const currentGig = gigsData[currentGigIndex]
  if (currentGig.posters[1]) {
    return (
      <div>
        <div className="variantContainer">
          {/* // conditionally render variant posters if there **Note** the max amount
        of variants a poster can have is four */}

          {currentGig.posters[1] && (
            <div className="variantContainerColumn">
              <p>Variant 1</p>
              <img
                className="variantGigPoster"
                src={'/posters/' + currentGig.posters[1].image}
                alt="Variant 1 poster"
              ></img>
              <p>Design by {currentGig.posters[1].designer}</p>
            </div>
          )}
          {currentGig.posters[2] && (
            <div className="variantContainerColumn">
              <p>Variant 2</p>
              <img
                className="variantGigPoster"
                src={'/posters/' + currentGig.posters[2].image}
                alt="Variant 2 poster"
              ></img>
              <p>Design by {currentGig.posters[2].designer}</p>
            </div>
          )}
          {currentGig.posters[3] && (
            <div className="variantContainerColumn">
              <p>Variant 3</p>
              <img
                className="variantGigPoster"
                src={'/posters/' + currentGig.posters[3].image}
                alt="Variant 3 poster"
              ></img>
              <p>Design by {currentGig.posters[3].designer}</p>
            </div>
          )}
          {currentGig.posters[4] && (
            <div className="variantContainerColumn">
              <p>Variant 4</p>
              <img
                className="variantGigPoster"
                src={'/posters/' + currentGig.posters[4].image}
                alt="Variant 4 poster"
              ></img>
              <p>Design by {currentGig.posters[4].designer}</p>
            </div>
          )}
        </div>
      </div>
    )
  }
}
