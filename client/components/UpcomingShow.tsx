//Nothing tooo crazy here, main things of note are
// 1. the tools div with Draggable plugin, had lots of issues getting it working with page loads etc so the useEffect for it (line 40)
// has a bit going on (i'm not sure it really needs the array of draggables but it took so long to get it working that for now i'm
// moving on to other things instead of refactoring it)
// 2. the text formatting stuff for the title is Not Practical but i am proud of it despite this. When i get the time i would like it
// to factor in fonts (because the header in the page will have user customisable fonts soon) and measure character space taken up vs
// just number of characters like it does now

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
import { ToolsSymbol } from './SmallerComponents/SymbolSvgs'
import { PosterUploader } from './SmallerComponents/PosterUploader'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPoster } from '../apis/posters'
import { Toast } from 'radix-ui'
import React from 'react'
import { useImage } from '../hooks/useImage'
import { Poster } from '../../models/poster'
import { Cross1Icon } from '@radix-ui/react-icons'

gsap.registerPlugin(Draggable)

interface PosterVariables {
  posterData: {
    image: string
    designer: string
    upcomingShowId: number
  }
  token: string
}

export function UpcomingShow() {
  const draggableRef = useRef(null)
  const { deleteImage } = useImage()
  const [titleBackHeight, setTitleBackHeight] = useState('')
  const [titleTextSize, setTitleTextSize] = useState('')
  const [titleWrap, setTitleWrap] = useState('')
  const [toolsHiddenClass, setToolsHiddenClass] = useState('')
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef(0)
  const [addPosterIsHidden, setAddPosterIsHidden] = useState(true)
  const [managePosterIsHidden, setManagePosterIsHidden] = useState(true)
  const queryClient = useQueryClient()
  const posterUploadMutation = useMutation({
    mutationFn: ({ posterData, token }: PosterVariables) =>
      addPoster(posterData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posters'] }),
  })
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
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
    const currentTime = timerRef.current
    return () => clearTimeout(currentTime)
  }, [])

  useEffect(() => {
    let draggables: Draggable[] = []
    if (draggableRef.current && data && managePosterIsHidden == true) {
      draggables = Draggable.create(draggableRef.current, {
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
    return () => {
      draggables.forEach((d) => d.kill())
    }
  }, [isAuthenticated, data, managePosterIsHidden])

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

  function handleAddClick() {
    if (managePosterIsHidden == false) {
      setManagePosterIsHidden(true)
    }
    if (addPosterIsHidden == true) {
      setAddPosterIsHidden(false)
    } else {
      setAddPosterIsHidden(true)
    }
  }

  function handleManageClick() {
    if (addPosterIsHidden == false) {
      setAddPosterIsHidden(true)
    }
    if (managePosterIsHidden == true) {
      setManagePosterIsHidden(false)
    } else {
      setManagePosterIsHidden(true)
    }
  }

  async function handleAddAltPosterSuccess(url: string, designer: string) {
    try {
      console.log('Image uploaded successfully! URL:', url)
      const token = await getAccessTokenSilently()
      const upcomingShowId = data.id
      // use poster mutation to add poster
      const newPosterId = await posterUploadMutation.mutateAsync({
        posterData: {
          image: url,
          designer: designer,
          upcomingShowId: upcomingShowId,
        },
        token: token,
      })
      const submissionData = {
        posterId: newPosterId,
      }
      // update show with new posterId
      editShowMutation.mutate({
        id: upcomingShowId,
        showData: submissionData,
        token,
      })
      setAddPosterIsHidden(true)
      setOpen(false)
      window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setOpen(true)
      }, 100)
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  async function handleManagePosterClick(poster: Poster) {
    console.log('deleting old poster')
    const token = await getAccessTokenSilently()

    const mutationVariables = { url: poster.image, token: token }
    deleteImage.mutate(mutationVariables)
    deletePosterMutation.mutate({ id: poster.id, token })
  }

  // RESPONSIVE TITLE STUFF
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
      <div className="large-screen hidden min-h-[calc(100vh-4rem)] flex-row sm:flex">
        <Toast.Provider swipeDirection="right">
          <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
            <Toast.Title className="ToastTitle">
              Poster added successfully
            </Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="ToastViewport" />
          {managePosterIsHidden == false && (
            <div className="AlertDialogOverlay mx-auto">
              <div className="ManagePostersContent flex h-fit w-fit cursor-default flex-wrap items-center justify-center rounded-sm border-2 bg-[#f7f9ef] shadow-sm shadow-black/10">
                <div className="mb-1 flex w-full items-center justify-between rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0] p-1">
                  <div className="flex flex-row items-center">
                    <ToolsSymbol className="mr-0.5 h-8" />
                    <p> Manage posters</p>
                  </div>
                  <button
                    className="shadow-black-20 h-fit rounded-md border bg-[#fa9292] p-1 shadow-md hover:bg-[#f87070] active:bg-[#fa4c4c]"
                    onClick={handleManageClick}
                  >
                    <Cross1Icon />
                  </button>
                </div>

                {poster.length > 0 &&
                  poster.map((poster: Poster) => (
                    <div
                      key={poster.id}
                      className="group relative m-1 h-56 w-fit min-w-36"
                    >
                      <img
                        alt={'poster by' + poster.designer}
                        src={poster.image}
                        className="h-full w-full rounded-sm border-[1.5px] bg-white object-contain"
                      ></img>
                      <div className="absolute inset-0 flex h-56 flex-col items-center justify-center rounded-sm bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleManagePosterClick(poster)}
                          className="rounded-sm border-[1.5px] bg-[#fe4242] px-1 py-0.5 text-white active:bg-[#f75353]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                {poster.length == 0 && (
                  <p className="my-24 text-xl">
                    This show doesn&apos;t have any posters yet!
                  </p>
                )}
              </div>
            </div>
          )}
          {isAuthenticated &&
            data?.userId == user?.sub &&
            managePosterIsHidden == true && (
              <div
                ref={draggableRef}
                className={`absolute top-10 left-2 z-50 ${toolsHiddenClass} w-fit rounded-md border-2 bg-[#ffffff] shadow-lg shadow-black/20`}
              >
                <div
                  data-drag-trigger="true"
                  className="flex min-w-40 flex-row items-center rounded-t-sm border-b-2 bg-[#d9d7c0] py-0.5"
                  style={{ cursor: 'grab' }}
                >
                  <ToolsSymbol className="h-8" />
                  <p>Tools</p>
                </div>
                <div className="flex flex-col rounded-b-md">
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button
                        onClick={() => setToolsHiddenClass('hidden')}
                        className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                      >
                        Delete show
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay className="AlertDialogOverlay" />
                      <AlertDialog.Content className="AlertDialogContent">
                        <AlertDialog.Title className="AlertDialogTitle">
                          Delete show?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="AlertDialogDescription">
                          This cannot be undone. Shows can be canceled instead
                          to alert attendees.
                        </AlertDialog.Description>
                        <div
                          style={{
                            display: 'flex',
                            gap: 25,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <AlertDialog.Cancel asChild>
                            <button
                              onClick={() => setToolsHiddenClass('')}
                              className="rounded-md border border-[#c6c6c6] px-1 shadow-md hover:bg-[#faf8f1]"
                            >
                              Cancel
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              className="rounded-md border border-[#e6e6e6] bg-[#fa3131] p-2 px-1 text-[#faf8f1] shadow-md hover:bg-[#fd7474]"
                              onClick={() => handleDeleteClick(data.id)}
                            >
                              Delete
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>

                  <button
                    onClick={() => handleEditClick(data.id)}
                    className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                  >
                    Edit details
                  </button>
                  {data.canceled ? (
                    <button
                      className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                      onClick={() => handleCancelClick(data.id, true)}
                    >
                      Uncancel show
                    </button>
                  ) : (
                    <button
                      className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                      onClick={() => handleCancelClick(data.id, false)}
                    >
                      Cancel show
                    </button>
                  )}
                  <button
                    onClick={handleAddClick}
                    className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                  >
                    Add alt poster
                  </button>
                  {addPosterIsHidden == false && (
                    <div className="absolute top-30 -right-63 flex w-60 flex-col rounded-sm border-2 bg-[#e9ecdf] px-1 py-0.5 shadow-sm shadow-black/10">
                      <p className="mb-1 px-0.5">Add alt poster</p>
                      <PosterUploader
                        uploadSuccess={handleAddAltPosterSuccess}
                        currentNumberOfPosters={poster.length}
                      />
                      {addPosterIsHidden == false && poster.length >= 5 && (
                        <div className="">
                          <p className="mb-1 px-0.5">
                            If you would like to remove any use the
                            <span>
                              <button
                                onClick={handleManageClick}
                                className="w-ful mr-0.5 rounded-md border-[1.5px] border-[#d8d8d7] bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                              >
                                Manage posters
                              </button>
                            </span>
                            tool.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleManageClick}
                    className="w-ful rounded-b-md bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                  >
                    Manage posters
                  </button>
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
                        <h3 className="text-sm lg:text-xl">
                          {data.description}
                        </h3>
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
        </Toast.Provider>
      </div>
      <div className="phone-screen flex sm:hidden">
        <p>Smallscreen</p>
      </div>
    </div>
  )
}

// import { Toast } from "radix-ui";

// export default () => (
// 	<Toast.Provider>
// 		<Toast.Root>
// 			<Toast.Title />
// 			<Toast.Description />
// 			<Toast.Action />
// 			<Toast.Close />
// 		</Toast.Root>

// 		<Toast.Viewport />
// 	</Toast.Provider>
// );

// import * as React from "react";
// import { Toast } from "radix-ui";
// import "./styles.css";

// const ToastDemo = () => {
// 	const [open, setOpen] = React.useState(false);
// 	const eventDateRef = React.useRef(new Date());
// 	const timerRef = React.useRef(0);

// 	React.useEffect(() => {
// 		return () => clearTimeout(timerRef.current);
// 	}, []);

// 	return (
// 		<Toast.Provider swipeDirection="right">
// 			<button
// 				className="Button large violet"
// 				onClick={() => {
// 					setOpen(false);
// 					window.clearTimeout(timerRef.current);
// 					timerRef.current = window.setTimeout(() => {
// 						eventDateRef.current = oneWeekAway();
// 						setOpen(true);
// 					}, 100);
// 				}}
// 			>
// 				Add to calendar
// 			</button>

// 			<Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
// 				<Toast.Title className="ToastTitle">Scheduled: Catch up</Toast.Title>
// 				<Toast.Description asChild>
// 					<time
// 						className="ToastDescription"
// 						dateTime={eventDateRef.current.toISOString()}
// 					>
// 						{prettyDate(eventDateRef.current)}
// 					</time>
// 				</Toast.Description>
// 			</Toast.Root>
// 			<Toast.Viewport className="ToastViewport" />
// 		</Toast.Provider>
// 	);
// };

// function oneWeekAway(date) {
// 	const now = new Date();
// 	const inOneWeek = now.setDate(now.getDate() + 7);
// 	return new Date(inOneWeek);
// }

// function prettyDate(date) {
// 	return new Intl.DateTimeFormat("en-US", {
// 		dateStyle: "full",
// 		timeStyle: "short",
// 	}).format(date);
// }

// export default ToastDemo;
