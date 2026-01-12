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
import { useEffect, useState } from 'react'

interface Props {
  show: UpcomingShow
}

export function UpcomingShowCard({ show }: Props) {
  const {
    data: poster,
    isLoading: posterIsLoading,
    isError: posterIsError,
  } = usePosters(show.id)
  const [titleTextSize, setTitleTextSize] = useState('')
  const [titleWrap, setTitleWrap] = useState('')

  useEffect(() => {
    if (show) {
      lengthDisplayCheck(show.performers)
    }
  }, [show])

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

  const lengthDisplayCheck = (input: string) => {
    // number > 23 background 28 text 8
    const length = input.length
    const hasSpaces = input.includes(' ')
    if (length > 1 && length < 25) {
      setTitleTextSize('text-xl sm:text-[clamp(3.75rem,5vw,6rem)] leading-none')

      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }
    if (length >= 25 && length < 30) {
      setTitleTextSize('text-xl sm:text-[clamp(3.75rem,5vw,6rem)] leading-none')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }
    if (length >= 30 && length < 50) {
      setTitleTextSize('text-xl sm:text-[clamp(3rem,5vw,6rem)] leading-none')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }

    if (length >= 50 && length < 70) {
      setTitleTextSize('text-lg sm:text-[clamp(3rem,5vw,6rem)] leading-none')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }
    if (length >= 70) {
      setTitleTextSize('text-lg sm:text-[clamp(1rem,4vw,3rem)] leading-none')
    }
  }

  return (
    <div
      key={show.id}
      className="mb-2 flex w-full flex-row items-start text-sm text-wrap sm:text-base"
    >
      <div className="w-full">
        <Link to={`/upcomingshows/${show.id}`}>
          <div className="flex h-full w-full sm:min-h-[273px] sm:flex-row">
            {/* border border-[#43434320] bg-[#f2e8d95c] */}
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
            <div className="infoDivLarge sm:height-[240px] flex w-full flex-col">
              {Boolean(show.canceled) && (
                <div className="flex w-full flex-row items-center bg-[#fd7979] p-1">
                  <AlertSymbol className="h-7" />
                  <p className="pl-1">This show has been cancelled</p>
                </div>
              )}

              <div className="titleAndDetails sm:height-[240px] flex flex-col p-1 sm:my-auto sm:p-2">
                <div className="flex h-fit w-full flex-row justify-between">
                  <div className="AccessibilitySymbolDiv hidden h-fit w-fit flex-row rounded-xs border border-[#4d5d53]">
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
                {show.name ? (
                  <h2
                    className={`${titleTextSize} text-justify text-wrap ${titleWrap}`}
                  >
                    {show.name}: {show.performers}
                  </h2>
                ) : (
                  <h2
                    className={`${titleTextSize} text-justify text-wrap ${titleWrap}`}
                  >
                    {show.performers}
                  </h2>
                )}
                <div className="flex flex-col">
                  <div className="mt-1 flex justify-between pl-0.5 text-sm font-extralight sm:mt-2 sm:text-2xl">
                    <p className="">{show.locationName}</p>
                    <p className="block text-[#000000] sm:hidden">
                      {formatDateSmall(show.date)}
                    </p>
                    <p className="hidden text-[#000000] sm:block">
                      {formatDatePretty(show.date)}
                    </p>
                  </div>
                  <div className="mt-0 flex justify-between pl-0.5 text-sm font-extralight sm:mt-1 sm:text-2xl">
                    <p>{show.price}</p>
                    <p className="ml-1 text-[#000000]">{show.doorsTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default UpcomingShowCard
