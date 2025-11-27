import {
  useUpcomingShows,
  useDeleteUpcomingShow,
} from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Tooltip } from 'radix-ui'
import { useState, useEffect } from 'react'
import SearchBar from './SearchBar'

export function UpcomingShows() {
  const { data, isLoading, isError } = useUpcomingShows()
  const deleteShowMutation = useDeleteUpcomingShow()
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const navigate = useNavigate()
  const [currentData, setCurrentData] = useState<UpcomingShow[]>()
  const [searchTerm, setSearchTerm] = useState<string>()

  useEffect(() => {
    if (data) {
      setCurrentData(data)
    }
  }, [data])

  if (isLoading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="h-8 w-8 animate-spin fill-[#c1bd9a] text-gray-200 dark:text-gray-600"
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

  function MobilitySymbol() {
    return (
      <div>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <svg
                className="relative"
                width="26"
                height="26"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M116.666 41.6667C116.666 50.8714 109.204 58.3333 99.9997 58.3333C90.7949 58.3333 83.333 50.8714 83.333 41.6667C83.333 32.4619 90.7949 25 99.9997 25C109.204 25 116.666 32.4619 116.666 41.6667ZM125 66.6667L133.333 116.667H120.833V175H104.166V125H95.8331V175H79.1664V125H79.1663V102.381L70.833 116.667H66.6663V175H58.333V116.667H49.9997L79.1663 66.6667H95.833H99.9997H125Z"
                  fill="black"
                />
              </svg>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent" sideOffset={5}>
                Gig mobility accessiblity status
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    )
  }

  function WheelchairSymbol() {
    return (
      <div>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <svg
                className="relative"
                width="26"
                height="26"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M104.138 41.6667C104.138 50.8714 96.6797 58.3333 87.4799 58.3333C78.2801 58.3333 70.8222 50.8714 70.8222 41.6667C70.8222 32.4619 78.2801 25 87.4799 25C96.6797 25 104.138 32.4619 104.138 41.6667ZM116.294 137.45C116.516 136.111 116.631 134.736 116.631 133.333C116.631 128.78 115.414 124.51 113.288 120.833C111.439 117.636 108.903 114.886 105.882 112.786C105.793 112.724 105.704 112.663 105.615 112.603C101.627 109.907 96.8192 108.333 91.6443 108.333C90.2866 108.333 88.9542 108.442 87.6552 108.65C75.7516 110.561 66.6577 120.885 66.6577 133.333C66.6577 147.14 77.8446 158.333 91.6443 158.333C104.025 158.333 114.303 149.324 116.285 137.5C116.288 137.483 116.291 137.467 116.294 137.45ZM133.083 137.5C130.994 158.556 113.238 175 91.6443 175C68.6448 175 50 156.345 50 133.333C50 112.729 64.9472 95.6182 84.5842 92.263L79.7875 66.6667H91.0071H96.7355H98.7902L102.87 93.1979C116.42 96.9839 127.182 107.455 131.382 120.833H138.119C139.346 120.833 140.543 120.967 141.698 121.22C148.696 122.755 154.102 128.701 154.719 136.116L158.333 166.666L141.667 166.667L138.119 137.5H133.083Z"
                  fill="black"
                />
              </svg>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent" sideOffset={5}>
                Wheelchair accessiblity status
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    )
  }

  function BathroomSymbol() {
    return (
      <div>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <svg
                className="relative top-0.5 mr-1 ml-1"
                width="23"
                height="23"
                viewBox="0 0 512 512"
                fill="black"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="512" height="512" fill="url(#pattern0_1_2)" />
                <defs>
                  <pattern
                    id="pattern0_1_2"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="10"
                  >
                    <use
                      xlinkHref="#image0_1_2"
                      transform="scale(0.00195312)"
                    />
                  </pattern>
                  <image
                    id="image0_1_2"
                    width="512"
                    height="512"
                    preserveAspectRatio="none"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="TooltipContent" sideOffset={5}>
                Bathrooms nearby status
                <Tooltip.Arrow className="TooltipArrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    )
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

  async function handleDeleteClick(id: number) {
    const token = await getAccessTokenSilently()
    if (!isAuthenticated) {
      alert('You need to log in to delete shows')
    }
    deleteShowMutation.mutate({ id, token })
  }

  const handleEditClick = (id: number) => {
    navigate(`/showeditform/${id}`)
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
      <div className="upcomingShowsBox">
        {currentData &&
          currentData.map((show: UpcomingShow) => (
            <div
              key={show.id}
              className="mb-2 flex w-screen flex-row items-start gap-4 text-sm text-wrap sm:h-auto sm:w-auto sm:p-2 sm:text-base"
            >
              <div className="flex w-screen flex-row border border-[#dad7c2] bg-[#f2e8d95c] sm:w-auto sm:border-0">
                <div className="w-2/5 sm:w-auto">
                  <img
                    className="h-50 object-contain"
                    src="./posters/valhallaJuly10th.jpg"
                    alt="temp poster"
                  ></img>
                </div>
                <div className="flex w-3/5 flex-col pt-1 pr-1 sm:w-auto sm:min-w-80 sm:border sm:border-[#dad7c2] sm:p-2">
                  <div className="w-fill flex flex-row items-center">
                    <div className="flex flex-row place-items-center sm:max-w-3/4">
                      <p className="font-sans text-[#635e60]">
                        {formatDate(show.date)}{' '}
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
                      <p className="text-base font-medium">{show.performers}</p>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm font-extralight">
                        {show.locationName} - {show.price}
                      </p>
                    </div>
                  </div>
                  {/* {show.description && <p>{show.description} </p>}

            {show.setTimes && <p>Set times: {show.setTimes}</p>} */}
                  {/* 
            {show.noiseLevel === 'high' && (
              <p>Noise level: High (bring earplugs)</p>
            )} */}
                  {/* {show.noiseLevel === 'medium' && <p>Noise level: Medium</p>}
            {show.noiseLevel === 'low' && <p>Noise level: Low / safe</p>}
            {show.maxCapacity && <p>Max capacity: {show.maxCapacity} </p>} */}
                  {/* {/* {show.ticketsLink && (
              <p>
                Link to buy tickets: <a href={show.ticketsLink}>Here</a>
              </p>
            )}
            \*} */}
                  <div>
                    {isAuthenticated && (
                      <div className="mt-2 flex flex-row sm:mt-16">
                        <AlertDialog.Root>
                          <AlertDialog.Trigger asChild>
                            <button className="mr-2 inline-flex justify-center rounded-md bg-[#fcbdb3] p-1 text-xs font-medium text-black shadow-sm hover:bg-[#f5715c] sm:p-2 sm:text-sm">
                              Delete show
                            </button>
                          </AlertDialog.Trigger>
                          <AlertDialog.Portal>
                            <AlertDialog.Overlay className="AlertDialogOverlay" />
                            <AlertDialog.Content className="AlertDialogContent">
                              <AlertDialog.Title className="AlertDialogTitle">
                                Are you sure?
                              </AlertDialog.Title>
                              <AlertDialog.Description className="AlertDialogDescription">
                                This action cannot be undone. This will
                                permanently delete this show and its data from
                                our server. If the show is cancelled please
                                select cancel instead to notify attendees of the
                                change.
                              </AlertDialog.Description>
                              <div
                                style={{
                                  display: 'flex',
                                  gap: 25,
                                  justifyContent: 'flex-end',
                                }}
                              >
                                <AlertDialog.Cancel asChild>
                                  <button className="Button mauve">
                                    Cancel
                                  </button>
                                </AlertDialog.Cancel>
                                <AlertDialog.Action asChild>
                                  <button
                                    className="rounded-sm bg-red-400 p-2"
                                    onClick={() => handleDeleteClick(show.id)}
                                  >
                                    Yes, delete show
                                  </button>
                                </AlertDialog.Action>
                              </div>
                            </AlertDialog.Content>
                          </AlertDialog.Portal>
                        </AlertDialog.Root>
                        <br />
                        <button
                          className="inline-flex justify-center rounded-md bg-[#c1bd9a] p-1 text-sm font-medium text-black shadow-sm hover:bg-[#8f9779] sm:p-2 sm:text-sm"
                          onClick={() => handleEditClick(show.id)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
