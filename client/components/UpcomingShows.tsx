import { useUpcomingShows } from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import { useState, useEffect } from 'react'
import SearchBar from './SmallerComponents/SearchBar'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { UpcomingShowCard } from './SmallerComponents/UpcomingShowCard'
import { UpcomingPosterData } from '../../models/poster'

export function UpcomingShows() {
  const { data, isLoading, isError } = useUpcomingShows()

  const [currentData, setCurrentData] = useState<UpcomingShow[]>()
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
      const dateFilteredShows = dataWithDateObjects.filter(
        (show) => show.date >= currentDate,
      )

      setCurrentData(dateFilteredShows)
    }
  }, [data])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <h1>An error occured when loading upcoming shows</h1>
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
            <UpcomingShowCard key={show.id} show={show} />
          ))}
      </div>
    </div>
  )
}
