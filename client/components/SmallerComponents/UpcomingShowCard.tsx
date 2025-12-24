import { Link } from 'react-router'
import { UpcomingShow } from '../../../models/upcomingShow'
import { usePosters } from '../../hooks/usePosters'
import {
  BathroomSymbol,
  MobilitySymbol,
  WheelchairSymbol,
} from './AccessiblitySymbols'
import { LoadingSpinner } from './LoadingSpinner'

interface Props {
  show: UpcomingShow
}

export function UpcomingShowCard({ show }: Props) {
  const {
    data: poster,
    isLoading: posterIsLoading,
    isError: posterIsError,
  } = usePosters(show.id)

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    })
  }

  if (posterIsError) {
    // You can decide how to handle a missing poster
    // For now, we'll just log it and show a placeholder or nothing
    console.error(`Error loading poster for show ID: ${show.id}`)
  }

  return (
    <div
      key={show.id}
      className="mb-2 flex w-screen flex-row items-start gap-4 text-sm text-wrap sm:h-auto sm:w-auto sm:p-2 sm:text-base"
    >
      <Link to={`/upcomingshows/${show.id}`}>
        <div className="flex w-screen flex-row border border-[#dad7c2] bg-[#f2e8d95c] sm:w-auto sm:border-0">
          <div className="w-2/5 max-w-2/5 wrap-anywhere sm:w-auto">
            {posterIsLoading ? (
              <div className="flex h-full items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <img
                className="block h-50 min-w-0 object-contain wrap-break-word whitespace-normal"
                src={poster[0]?.image || 'Public/assets/defaultPoster.jpg'}
                alt={`Poster for ${show.performers}`}
              ></img>
            )}
          </div>

          <div className="flex w-3/5 max-w-80 flex-col sm:w-auto sm:min-w-80 sm:border sm:border-[#dad7c2]">
            {Boolean(show.canceled) && (
              <div className="w-full bg-[#f68484] p-1">
                This show has been cancelled
              </div>
            )}

            <div className="pt-1 pr-1 sm:p-2">
              <div className="w-fill flex flex-row items-center">
                <div className="flex flex-row place-items-center sm:max-w-3/4">
                  <p className="font-sans text-[#635e60]">
                    {formatDate(show.date)}
                  </p>
                  <p className="ml-2 font-sans text-[#6f696b]">
                    {show.doorsTime}
                  </p>
                </div>

                <div className="ml-auto flex h-fit w-fit flex-row rounded-xs border border-[#4d5d53]">
                  {show.mobilityAccessible ? (
                    <div className="bg-[#c1bd9a]">
                      <MobilitySymbol />
                    </div>
                  ) : (
                    <div className="bg-[#cf7c7c]">
                      <MobilitySymbol />
                    </div>
                  )}

                  {show.wheelchairAccessible ? (
                    <div className="bg-[#c1bd9a]">
                      <WheelchairSymbol />
                    </div>
                  ) : (
                    <div className="bg-[#cf7c7c]">
                      <WheelchairSymbol />
                    </div>
                  )}
                  {show.bathroomsNearby ? (
                    <div className="bg-[#c1bd9a]">
                      <BathroomSymbol />
                    </div>
                  ) : (
                    <div className="bg-[#cf7c7c]">
                      <BathroomSymbol />
                    </div>
                  )}
                </div>
              </div>
              <div className="">
                <div className="mt-2">
                  <p className="clamped-text text-base font-medium text-wrap">
                    {show.performers}
                  </p>
                </div>
                <div className="mt-1">
                  <p className="text-sm font-extralight">
                    {show.locationName} - {show.price}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default UpcomingShowCard
