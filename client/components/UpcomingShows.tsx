import { useUpcomingShows } from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import { useState, useEffect } from 'react'
import SearchBar from './SmallerComponents/SearchBar'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { UpcomingShowCard } from './SmallerComponents/UpcomingShowCard'
import { Link } from 'react-router'
import { PaintbrushSymbol } from './SmallerComponents/SymbolSvgs'
import { Footer } from './Footer'

export function UpcomingShows() {
  const { data, isLoading, isError } = useUpcomingShows()

  const [currentData, setCurrentData] = useState<UpcomingShow[]>()
  const [dateFilteredData, setDateFilteredData] = useState<UpcomingShow[]>()
  const [searchTerm, setSearchTerm] = useState<string>()

  useEffect(() => {
    if (data) {
      const dataToMap = data
      const dataWithDateObjects = dataToMap.map((item: UpcomingShow) => {
        return {
          ...item,
          date: new Date(item.date),
        }
      })
      dataWithDateObjects.sort((a, b) => a.date.getTime() - b.date.getTime())
      const currentDate = new Date()
      currentDate.setHours(0, 0, 0, 0)
      const dateFilteredShows = dataWithDateObjects.filter(
        (show) => show.date >= currentDate,
      )

      setDateFilteredData(dateFilteredShows)
      setCurrentData(dateFilteredShows)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full place-content-center place-items-center">
        <div className="inset-0 m-auto h-fit w-fit">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-[calc(100vh-5rem)] w-full place-content-center place-items-center">
        <div className="inset-0 m-auto h-fit w-fit">
          <h1 className="sm:text-xl">
            An error occured when loading upcoming shows
          </h1>
        </div>
      </div>
    )
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
          item.price.toLowerCase().includes(lowerCaseSearchTerm) ||
          (item.name && item.name.toLowerCase().includes(lowerCaseSearchTerm)),
      )
      setCurrentData(filteredData)
    } else if (data) {
      setCurrentData(dateFilteredData)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-1">
      <div className="mb-2 flex h-fit flex-row rounded-md">
        <div className="mr-1 flex cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] bg-[#dad7c2] px-1 text-sm hover:bg-[#e2e0cf] active:bg-[#c1bd9a]">
          <Link to="/showuploadform" className="flex flex-row items-center">
            <PaintbrushSymbol className={'h-4 sm:h-5'} />
            <p className="p-1 text-xs sm:text-sm">Add a show</p>
          </Link>
        </div>
        <div className="h-fit w-fit rounded-md border-[1.5px] border-[#dad7c2]">
          <SearchBar
            submitFunction={handleSearch}
            changeFunction={handleChange}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      <div className="mt-1">
        {currentData &&
          currentData.map((show: UpcomingShow) => (
            <UpcomingShowCard key={show.id} show={show} />
          ))}
      </div>
    </div>
  )
}
