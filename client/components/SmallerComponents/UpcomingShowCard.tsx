import { Link } from 'react-router'
import { UpcomingShow } from '../../../models/upcomingShow'
import { usePosters } from '../../hooks/usePosters'
import {
  BathroomSymbol,
  MobilitySymbol,
  WheelchairSymbol,
} from './AccessiblitySymbols'
import { LoadingSpinner } from './LoadingSpinner'
import { AlertSymbol } from './SymbolSvgs'

interface Props {
  show: UpcomingShow
}

export function UpcomingShowCard({ show }: Props) {
  const {
    data: poster,
    isLoading: posterIsLoading,
    isError: posterIsError,
  } = usePosters(show.id)

  function formatDateSmall(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    })
  }

  function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  function formatDatePretty(dateString: string) {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-NZ', { month: 'long' })
    const year = date.getFullYear()

    return `${month} ${day}${getOrdinalSuffix(day)} ${year}`
  }

  if (posterIsError) {
    console.error(`Error loading poster for show ID: ${show.id}`)
  }

  return (
    <div
      key={show.id}
      className="mb-2 flex w-full flex-row items-start text-sm text-wrap sm:text-base"
    >
      <div className="w-full">
        <Link to={`/upcomingshows/${show.id}`}>
          <div className="relative flex w-full border border-[#43434320] bg-[#f2e8d95c] sm:flex-row sm:items-center">
            <div className="h-fit wrap-anywhere sm:min-h-[273px]">
              {posterIsLoading ? (
                <div className="animation-pulse h-[273px] w-36">
                  <LoadingSpinner />
                </div>
              ) : (
                <img
                  className="block h-50 max-w-36 min-w-36 object-contain wrap-break-word whitespace-normal sm:h-fit sm:w-60 sm:max-w-60"
                  src={poster[0]?.image || 'Public/assets/defaultPoster.jpg'}
                  alt={`Poster for ${show.performers}`}
                ></img>
              )}
            </div>
            <div className="infoDivLarge pl-1 sm:pl-0">
              <div className="flex h-full w-full flex-col justify-center sm:min-w-80">
                {Boolean(show.canceled) && (
                  <div className="flex w-full flex-row items-center bg-[#fd7979] p-1">
                    <AlertSymbol className="h-7" />
                    <p className="pl-1">This show has been cancelled</p>
                  </div>
                )}

                <div className="flex h-full flex-col justify-center pt-1 pr-1 sm:p-2">
                  <div className="flex w-full">
                    <div className="absolute top-1 right-1 ml-auto flex h-fit w-fit flex-row rounded-xs border border-[#4d5d53]">
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

                  <div className="flex flex-row text-sm sm:text-2xl">
                    <p className="block font-sans text-[#635e60] sm:hidden">
                      {formatDateSmall(show.date)}
                    </p>
                    <p className="hidden font-sans text-[#635e60] sm:block">
                      {formatDatePretty(show.date)},
                    </p>
                    <p className="ml-2 font-sans text-[#6f696b]">
                      {show.doorsTime}
                    </p>
                  </div>

                  <div className="sm:mt-3">
                    <p className="clamped-text text-base text-wrap sm:pb-4 sm:text-7xl">
                      {show.performers}
                    </p>

                    <div className="">
                      <p className="text-sm font-extralight sm:text-4xl">
                        {show.locationName} - {show.price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="infoDivSmall block sm:hidden">
              <div className="flex w-full flex-col sm:border sm:border-[#dad7c2]">
                {Boolean(show.canceled) && (
                  <div className="flex w-full flex-row items-center bg-[#fd7979] p-1">
                    <AlertSymbol className="h-7" />
                    <p className="pl-1">This show has been cancelled</p>
                  </div>
                )}

                <div className="p-1">
                  <div className="w-fill flex flex-row items-center">
                    <div className="flex flex-row place-items-center sm:max-w-3/4">
                      <p className="font-sans text-[#635e60]">
                        {formatDateSmall(show.date)}
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
            </div> */}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default UpcomingShowCard
