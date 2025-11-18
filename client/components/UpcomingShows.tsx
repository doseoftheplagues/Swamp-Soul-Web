import {
  useUpcomingShows,
  useDeleteUpcomingShow,
} from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'

export function UpcomingShows() {
  const { data, isLoading, isError } = useUpcomingShows()
  const deleteShowMutation = useDeleteUpcomingShow()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="h-8 w-8 animate-spin fill-green-800 text-gray-200 dark:text-gray-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (isError) {
    return <h1>An error occured when loading upcoming shows</h1>
  }

  async function handleDeleteClick(id: number) {
    const token = await getAccessTokenSilently()
    if (!isAuthenticated) {
      alert('You need to log in to delete shows')
    }
    deleteShowMutation.mutate(id, token)
  }

  const handleEditClick = (id: number) => {
    navigate(`/showeditform/${id}`)
  }

  return (
    <div>
      {data.map((show: UpcomingShow) => (
        <div
          key={show.id}
          className="m-1 flex flex-row border-2 border-b-stone-500 bg-teal-50 p-1 sm:p-5"
        >
          <div>
            <img
              className="h-35 sm:h-65"
              src="./posters/valhallaJuly10th.jpg"
              alt="temp poster"
            ></img>
          </div>
          <div>
            <h1>{show.locationName}</h1>
            <p>
              {show.date} {show.doorsTime}
            </p>
            <p>{show.performers}</p>
            {/* {show.description && <p>{show.description} </p>}

            {show.setTimes && <p>Set times: {show.setTimes}</p>} */}
            {/* 
            {show.noiseLevel === 'high' && (
              <p>Noise level: High (bring earplugs)</p>
            )} */}
            {/* {show.noiseLevel === 'medium' && <p>Noise level: Medium</p>}
            {show.noiseLevel === 'low' && <p>Noise level: Low / safe</p>}
            {show.maxCapacity && <p>Max capacity: {show.maxCapacity} </p>} */}
            {/* {show.ticketsLink && (
              <p>
                Link to buy tickets: <a href={show.ticketsLink}>Here</a>
              </p>
            )}
            {show.bathroomsNearby ? (
              <p>Venue has accessible bathrooms</p>
            ) : (
              <p>Venue has no accessible bathrooms nearby</p>
            )}
            {show.mobilityAccessible ? (
              <p>Venue is easily accessible for anyone with limited mobility</p>
            ) : (
              <p>
                Venue is not easily accessible for anyone with limited mobility
              </p>
            )}
            {show.wheelchairAccessible ? (
              <p>Venue is wheelchair accessible </p>
            ) : (
              <p>Venue is not wheelchair accessible</p>
            )} */}
            {isAuthenticated && (
              <div>
                <button onClick={() => handleDeleteClick(show.id)}>
                  Delete show
                </button>
                <button onClick={() => handleEditClick(show.id)}>Edit</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
