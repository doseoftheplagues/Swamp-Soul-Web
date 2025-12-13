import { useUpcomingShows } from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import { Link } from 'react-router'

import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import {
  BathroomSymbol,
  MobilitySymbol,
  WheelchairSymbol,
} from './SmallerComponents/AccessiblitySymbols'

export function UpcomingShows() {
  const { data, isLoading, isError } = useUpcomingShows()

  const [currentData, setCurrentData] = useState<UpcomingShow[]>()
  const [searchTerm, setSearchTerm] = useState<string>()

  useEffect(() => {
    if (data) {
      setCurrentData(data)
    }
  }, [data])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <h1>An error occured when loading upcoming shows</h1>
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (data && searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      const filteredData = data.filter(
        (item: UpcomingShow) =>
          item.locationName.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.date.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.performers.toLowerCase().includes(lowerCaseSearchTerm) ||
          (item.description &&
            item.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
          (item.ticketsLink &&
            item.ticketsLink.toLowerCase().includes(lowerCaseSearchTerm)) ||
          item.price.toLowerCase().includes(lowerCaseSearchTerm),
      )
      setCurrentData(filteredData)
    } else if (data) {
      setCurrentData(data)
    }
  }

  return (
    <div>
      <SearchBar
        submitFunction={handleSearch}
        changeFunction={handleChange}
        searchTerm={searchTerm}
      />
      <div className="upcomingShowsBox mt-1">
        {currentData &&
          currentData.map((show: UpcomingShow) => (
            <div
              key={show.id}
              className="mb-2 flex w-screen flex-row items-start gap-4 text-sm text-wrap sm:h-auto sm:w-auto sm:p-2 sm:text-base"
            >
              <Link to={`/upcomingshows/${show.id}`}>
                <div className="flex w-screen flex-row border border-[#dad7c2] bg-[#f2e8d95c] sm:w-auto sm:border-0">
                  <div className="w-2/5 sm:w-auto">
                    <img
                      className="h-50 object-contain"
                      src="./posters/valhallaJuly10th.jpg"
                      alt="temp poster"
                    ></img>
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
          ))}
      </div>
    </div>
  )
}
