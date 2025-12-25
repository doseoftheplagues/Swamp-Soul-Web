import { useNavigate, useParams } from 'react-router'
import {
  useDeleteUpcomingShow,
  useGetUpcomingShowById,
  useUpdateUpcomingShow,
} from '../hooks/useUpcomingShows'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { useAuth0 } from '@auth0/auth0-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useEffect, useState, useRef } from 'react'
import { usePosters, useDeletePoster } from '../hooks/usePosters'
import { gsap } from 'gsap/dist/gsap'
import { Draggable } from 'gsap/dist/Draggable'

gsap.registerPlugin(Draggable)

export function UpcomingShow() {
  const draggableRef = useRef(null)
  const [titleBackHeight, setTitleBackHeight] = useState('')
  const [titleTextSize, setTitleTextSize] = useState('')
  const [titleWrap, setTitleWrap] = useState('')
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()
  const {
    data: poster,
    isLoading: posterIsLoading,
    isError: posterIsError,
  } = usePosters(Number(params.id))
  const deleteShowMutation = useDeleteUpcomingShow()
  const deletePosterMutation = useDeletePoster()
  const navigate = useNavigate()

  const editShowMutation = useUpdateUpcomingShow()

  useEffect(() => {
    if (draggableRef.current) {
      Draggable.create(draggableRef.current, {
        type: 'x,y',
        bounds: 'body',
        trigger: "[data-drag-trigger='true']",

        onPress: function () {
          this.target.style.cursor = 'grabbing'
        },
        onRelease: function () {
          this.target.style.cursor = 'grab'
        },
      })
    }
  }, [])

  useEffect(() => {
    if (data) {
      lengthDisplayCheck(data.performers)
    }
  }, [data])

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <p>an error occured</p>
  }
  if (posterIsError) {
    return <p>an error occured</p>
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  async function handleDeleteClick(showId: number) {
    const token = await getAccessTokenSilently()
    if (!isAuthenticated) {
      return alert('You need to log in to delete shows')
    }

    const posterToDelete = poster?.[0]

    const performDeleteShow = () => {
      deleteShowMutation.mutate(
        { id: showId, token },
        {
          onSuccess: () => {
            navigate(-1)
          },
        },
      )
    }

    if (posterToDelete) {
      deletePosterMutation.mutate(
        { id: posterToDelete.id, token },
        {
          onSuccess: () => {
            performDeleteShow()
          },
        },
      )
    } else {
      performDeleteShow()
    }
  }

  const handleEditClick = (id: number) => {
    navigate(`/showeditform/${id}`)
  }

  const handleCancelClick = async (
    id: number,
    isCurrentlyCanceled: boolean,
  ) => {
    const token = await getAccessTokenSilently()
    const showData = {
      canceled: !isCurrentlyCanceled,
    }
    editShowMutation.mutate({
      id: id,
      token,
      showData: showData,
    })
    navigate(-1)
  }

  const lengthDisplayCheck = (input: string) => {
    // number > 23 background 28 text 8
    const length = input.length
    const hasSpaces = input.includes(' ')
    if (length > 1 && length < 25) {
      setTitleTextSize('text-[clamp(3.75rem,5vw,6rem)] leading-none')
      setTitleBackHeight('min-h-28')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }
    if (length >= 25 && length < 30) {
      setTitleBackHeight('sm:min-h-28 md:min-h-28 lg:min-h-32 xl:min-h-40')
      setTitleTextSize('text-[clamp(3.75rem,5vw,6rem)] leading-none')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }
    if (length >= 30 && length < 50) {
      setTitleBackHeight('sm:min-h-28 md:min-h-28 lg:min-h-32 xl:min-h-40')
      setTitleTextSize('text-[clamp(3rem,5vw,6rem)] leading-none')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }

    if (length >= 50 && length < 70) {
      setTitleTextSize('text-[clamp(3rem,5vw,6rem)] leading-none')

      setTitleBackHeight('min-h-40')
      if (hasSpaces == true) {
        setTitleWrap('wrap-break-word')
      } else {
        setTitleWrap('wrap-anywhere')
      }
    }

    if (length >= 70) {
      setTitleTextSize('text-[clamp(1rem,4vw,3rem)] leading-none')
      setTitleWrap('wrap-anywhere')
      setTitleBackHeight('min-h-56 xl:min-h-48')
    }
  }

  // NOTE TO SELF -- performers text breaks at 20-23 max

  return (
    <div>
      {/* <div
        
        style={{
          position: 'absolute',
          top: '200px',
          left: '200px',
          width: '100px',
          height: '100px',
          backgroundColor: 'red',
          zIndex: 10000,
          cursor: 'grab',
        }}
      >
        Drag Me
      </div> */}
      <div className="large-screen hidden min-h-[calc(100vh-4rem)] flex-row sm:flex">
        {isAuthenticated && (
          <div
            ref={draggableRef}
            className="absolute top-10 left-2 z-100 w-fit rounded-md border-2 bg-[#ffffff] shadow-lg shadow-black/20"
          >
            <div
              data-drag-trigger="true"
              className="rounded-t-md border-b-2 bg-[#d9d7c0] px-2 py-0.5"
              style={{ cursor: 'grab' }}
            >
              <p>Tools</p>
            </div>
            <div className="rounded-b-md">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className="w-full bg-[#f7f9ef] px-2 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]">
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
                      This action cannot be undone. This will permanently delete
                      this show and its data from our server. If the show is
                      cancelled please select cancel instead to notify attendees
                      of the change.
                    </AlertDialog.Description>
                    <div
                      style={{
                        display: 'flex',
                        gap: 25,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <AlertDialog.Cancel asChild>
                        <button className="Button mauve">Cancel</button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          className="rounded-sm bg-red-400 p-2"
                          onClick={() => handleDeleteClick(data.id)}
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
                onClick={() => handleEditClick(data.id)}
                className="w-full bg-[#e9ecdf] px-2 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
              >
                Edit Show
              </button>
              {data.canceled ? (
                <button
                  className="w-full rounded-b-md bg-[#f7f9ef] px-2 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                  onClick={() => handleCancelClick(data.id, true)}
                >
                  Uncancel show
                </button>
              ) : (
                <button
                  className="w-full rounded-b-md bg-[#f7f9ef] px-2 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                  onClick={() => handleCancelClick(data.id, false)}
                >
                  Cancel show
                </button>
              )}
            </div>
          </div>
        )}
        <div className="infoDiv flex grow flex-col lg:min-w-3/5">
          <div className={` ${titleBackHeight}`}>
            <div>
              <div className="performerNameHeader absolute top-11 left-2 z-10 w-6/6 lg:w-5/6">
                <div className="w-5/6">
                  {data.title ? (
                    <h2 className={`${titleTextSize} text-wrap ${titleWrap}`}>
                      {' '}
                      {data.title}
                    </h2>
                  ) : (
                    <h2 className={`${titleTextSize} text-wrap ${titleWrap}`}>
                      {' '}
                      {data.performers}
                    </h2>
                  )}
                </div>
                <div className="sm:w-1/2 lg:w-6/9">
                  <div className="mt-4 ml-1">
                    <h3 className="text-xl lg:text-2xl">
                      {data.locationName}{' '}
                    </h3>
                    <h3 className="text-xl lg:text-2xl">
                      {formatDate(data.date)}
                    </h3>
                  </div>
                  {data.description && (
                    <div className="mt-2 ml-1">
                      <h3 className="text-sm lg:text-xl">{data.description}</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="basicInfo mt-auto text-lg">
            <div className="flex flex-row">
              <div className="mt-2 flex w-1/2 flex-col border-2 border-[#dad7c2] bg-[#eaeae066] p-2">
                <p className="text-[#414141e8]">Doors </p>
                <p className="my-1"> {data.doorsTime} </p>

                {data.setTimes && (
                  <div>
                    <p className="text-[#414141e8]">Set times </p>
                    <p className="my-1"> {data.setTimes} </p>
                  </div>
                )}
                <p className="text-[#414141e8]">Entry </p>
                <p className="my-1"> {data.price} </p>
              </div>
              <div className="mt-2 flex w-1/2 flex-col border-t-2 border-r-2 border-b-2 border-[#dad7c2] p-2 text-right">
                <p>Noise level</p>
                <p className="my-1">[ {data.noiseLevel} ]</p>
                <p>Bathrooms nearby?</p>
                <p className="my-1">
                  [ {data.bathroomsNearby ? 'Yes' : 'No'} ]
                </p>
                <p>Wheelchair access?</p>
                <p className="my-1">
                  [ {data.wheelchairAccessible ? 'Yes' : 'No'} ]
                </p>
                <p>Limited mobility access?</p>
                <p className="my-1">
                  [ {data.mobilityAccessible ? 'Yes' : 'No'} ]
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="posterDiv flex w-1/2 lg:w-fit">
          {posterIsLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <img
              className="block h-[calc(100vh-4rem)] min-w-0 object-contain wrap-break-word whitespace-normal"
              src={poster[0]?.image || 'Public/assets/defaultPoster.jpg'}
              alt={`Poster for ${data.performers}`}
            ></img>
          )}
        </div>
      </div>
      <div className="phone-screen flex sm:hidden">
        <p>Smallscreen</p>
      </div>
    </div>
  )
}
// return (
//   <div className="flex w-screen flex-col sm:mt-6 sm:flex-row">
//     <div className="flex w-full flex-col justify-center sm:flex-row">
//       <div className="flex w-screen flex-col justify-center sm:flex-row">
//         <div className="flex flex-col sm:flex-row sm:rounded-xs sm:border sm:border-[#dad6b4c1] sm:shadow">
//           <div className="flex place-content-center items-center align-middle">
//             <img
//               className="sm:object-fit h-72 sm:h-180"
//               src="../posters/valhallaJuly10th.jpg"
//               alt={data.locationName + ' ' + data.date + ' ' + 'poster'}
//             ></img>
//           </div>
//           <div className="flex w-full flex-col text-left text-wrap wrap-break-word sm:w-130">
//             {Boolean(data.canceled) && (
//               <div className="w-full bg-[#f68484] p-1 text-center">
//                 This show has been cancelled
//               </div>
//             )}
//             <div className="">
//               {data.name && (
//                 <div className="text-center">
//                   <h1 className="bg-[#dad7c28c] p-1 text-xl wrap-break-word sm:text-2xl">
//                     ⋆✩ {data.name} ✩｡
//                   </h1>

//                   <h1 className="bg-[#dad7c28c] p-1 text-lg wrap-break-word sm:text-xl">
//                     {data.performers}
//                   </h1>
//                 </div>
//               )}
//               {!data.name && (
//                 <div className="text-center">
//                   <h1 className="bg-[#dad7c28c] p-2 text-xl wrap-break-word sm:text-2xl">
//                     {data.performers}
//                   </h1>
//                 </div>
//               )}

//               <div className="flex w-full flex-col">
//                 <div className="text-center">
//                   <p className="bg-[#eaeae05e] p-2 text-center text-base whitespace-pre-line">
//                     {data.locationName} ₊✩‧₊ {formatDate(data.date)}
//                   </p>
//                 </div>
//                 <div className="flex flex-row">
//                   <div className="mt-2 flex w-1/2 flex-col bg-[#eaeae066] p-2">
//                     <p className="text-[#414141e8]">Doors </p>
//                     <p className="my-1"> {data.doorsTime} </p>
//                     {data.setTimes && (
//                       <div>
//                         <p className="text-[#414141e8]">Set times </p>
//                         <p className="my-1"> {data.setTimes} </p>
//                       </div>
//                     )}
//                     <p className="text-[#414141e8]">Entry </p>
//                     <p className="my-1"> {data.price} </p>
//                   </div>
//                   <div className="mt-2 flex w-1/2 flex-col border-l-2 border-[#dad7c2] p-2 text-right">
//                     <p>Noise level</p>
//                     <p className="my-1">[ {data.noiseLevel} ]</p>
//                     <p>Bathrooms nearby?</p>
//                     <p className="my-1">
//                       [ {data.bathroomsNearby ? 'Yes' : 'No'} ]
//                     </p>
//                     <p>Wheelchair access?</p>
//                     <p className="my-1">
//                       [ {data.wheelchairAccessible ? 'Yes' : 'No'} ]
//                     </p>
//                     <p>Limited mobility access?</p>
//                     <p className="my-1">
//                       [ {data.mobilityAccessible ? 'Yes' : 'No'} ]
//                     </p>
//                   </div>
//                 </div>
//               </div>

//
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )

// {isAuthenticated && (
//                 <div>
//                   <AlertDialog.Root>
//                     <AlertDialog.Trigger asChild>
//                       <button className="">Delete show</button>
//                     </AlertDialog.Trigger>
//                     <AlertDialog.Portal>
//                       <AlertDialog.Overlay className="AlertDialogOverlay" />
//                       <AlertDialog.Content className="AlertDialogContent">
//                         <AlertDialog.Title className="AlertDialogTitle">
//                           Are you sure?
//                         </AlertDialog.Title>
//                         <AlertDialog.Description className="AlertDialogDescription">
//                           This action cannot be undone. This will permanently
//                           delete this show and its data from our server. If the
//                           show is cancelled please select cancel instead to
//                           notify attendees of the change.
//                         </AlertDialog.Description>
//                         <div
//                           style={{
//                             display: 'flex',
//                             gap: 25,
//                             justifyContent: 'flex-end',
//                           }}
//                         >
//                           <AlertDialog.Cancel asChild>
//                             <button className="Button mauve">Cancel</button>
//                           </AlertDialog.Cancel>
//                           <AlertDialog.Action asChild>
//                             <button
//                               className="rounded-sm bg-red-400 p-2"
//                               onClick={() => handleDeleteClick(data.id)}
//                             >
//                               Yes, delete show
//                             </button>
//                           </AlertDialog.Action>
//                         </div>
//                       </AlertDialog.Content>
//                     </AlertDialog.Portal>
//                   </AlertDialog.Root>
//                   <br />
//                   <button onClick={() => handleEditClick(data.id)}>Edit</button>
//                 </div>
//               )}
