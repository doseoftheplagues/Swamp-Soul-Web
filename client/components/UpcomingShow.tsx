//Nothing tooo crazy here, main things of note are
// 1. the tools div with Draggable plugin, had lots of issues getting it working with page loads etc so the useEffect for it (line 40)
// has a bit going on (i'm not sure it really needs the array of draggables but it took so long to get it working that for now i'm
// moving on to other things instead of refactoring it)
// 2. the text formatting stuff for the title is Not Practical but i am proud of it despite this. When i get the time i would like it
// to factor in fonts (because the header in the page will have user customisable fonts soon) and measure character space taken up vs
// just number of characters like it does now

import { useNavigate, useParams, useLocation } from 'react-router'
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
import { useComments } from '../hooks/useComments'
import { CommentSection } from './SmallerComponents/CommentSection'

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
  const [phoneToolsIsHidden, setPhoneToolsIsHidden] = useState(true)
  const [phoneToolsTriggerIsHidden, setPhoneToolsTriggerIsHidden] =
    useState(false)
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef(0)
  const [addPosterIsHidden, setAddPosterIsHidden] = useState(true)
  const [managePosterIsHidden, setManagePosterIsHidden] = useState(true)
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0)
  const queryClient = useQueryClient()
  const posterUploadMutation = useMutation({
    mutationFn: ({ posterData, token }: PosterVariables) =>
      addPoster(posterData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posters'] }),
  })
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const { comments, isLoading: commentsIsLoading } = useComments({
    upcomingShowId: Number(params.id),
  })
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
  const {
    data: poster,
    isLoading: posterIsLoading,
    isError: posterIsError,
  } = usePosters(Number(params.id))
  const deleteShowMutation = useDeleteUpcomingShow()
  const deletePosterMutation = useDeletePoster()
  const navigate = useNavigate()
  const location = useLocation()

  const editShowMutation = useUpdateUpcomingShow()

  const nextPoster = () => {
    setCurrentPosterIndex((prevIndex) =>
      prevIndex === poster.length - 1 ? 0 : prevIndex + 1,
    )
  }
  useEffect(() => {
    if (!isLoading && location.hash) {
      const targetId = location.hash.substring(1) // Remove the '#'
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })

        targetElement.classList.add('animate-pulse')

        const animationDuration = 6000
        setTimeout(() => {
          targetElement.classList.remove('animate-pulse')
        }, animationDuration)
      }
    }
  }, [isLoading, location])

  const prevPoster = () => {
    setCurrentPosterIndex((prevIndex) =>
      prevIndex === 0 ? poster.length - 1 : prevIndex - 1,
    )
  }

  useEffect(() => {
    setCurrentPosterIndex(0)
  }, [poster])

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

  function handlePhoneToolsClick() {
    if (phoneToolsIsHidden == true) {
      setPhoneToolsIsHidden(false)
      setPhoneToolsTriggerIsHidden(true)
    } else {
      setPhoneToolsIsHidden(true)
      setPhoneToolsTriggerIsHidden(false)
    }
  }

  async function handleManagePosterClick(poster: Poster) {
    console.log('deleting old poster')
    const token = await getAccessTokenSilently()

    const mutationVariables = { url: poster.image, token: token }
    deleteImage.mutate(mutationVariables)
    deletePosterMutation.mutate({ id: poster.id, token })
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
      <div className="large-screen hidden min-h-[calc(100vh-4rem)] flex-col sm:flex">
        <div className="MainContentContainer flex flex-row">
          {data.canceled == true && (
            <div className="absolute top-10 right-2 z-20 h-fit w-fit rounded-md border-2 bg-[#fa7676] px-1.5 py-1">
              <p className="text-center text-lg">This show has been canceled</p>
            </div>
          )}
          <Toast.Provider swipeDirection="right">
            <Toast.Root
              className="ToastRoot"
              open={open}
              onOpenChange={setOpen}
            >
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
                      className="shadow-black-20 h-fit cursor-pointer rounded-md border bg-[#fa9292] p-1 shadow-md hover:bg-[#f87070] active:bg-[#fa4c4c]"
                      onClick={handleManageClick}
                    >
                      <Cross1Icon />
                    </button>
                  </div>

                  {poster.length > 0 &&
                    poster.map((poster: Poster) => (
                      <div
                        key={poster.id}
                        className="group relative m-1 my-5 h-56 w-fit min-w-36"
                      >
                        <img
                          alt={'poster by' + poster.designer}
                          src={poster.image}
                          className="h-full w-full rounded-sm border-[1.5px] bg-white object-contain"
                        ></img>
                        <div className="absolute inset-0 flex h-56 flex-col items-center justify-center rounded-sm bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <p className="p-2 text-center text-white">
                            Designer: {poster.designer}
                          </p>
                          <button
                            onClick={() => handleManagePosterClick(poster)}
                            className="cursor-pointer rounded-sm border-[1.5px] bg-[#fe4242] px-1 py-0.5 text-white active:bg-[#f75353]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  {poster.length == 0 && (
                    <div className="flex flex-col items-center justify-center">
                      <p className="mt-2 text-xl">
                        This show doesn&apos;t have any posters yet!
                      </p>
                      <img
                        className="mb-4 h-28 md:h-96"
                        src="/assets/Im-working-on-it.png"
                        alt="Bleb painting a poster"
                      ></img>
                    </div>
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
                          className="w-full cursor-pointer bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
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
                                className="cursor-pointer rounded-md border px-1 shadow-md hover:bg-[#e2dece]"
                              >
                                Cancel
                              </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                className="cursor-pointer rounded-md border bg-[#f8a1a1] p-2 px-1 shadow-md hover:bg-[#fd7474]"
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
                      className="w-full cursor-pointer bg-[#e9ecdf] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                    >
                      Edit details
                    </button>
                    {data.canceled ? (
                      <button
                        className="w-full cursor-pointer bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                        onClick={() => handleCancelClick(data.id, true)}
                      >
                        Uncancel show
                      </button>
                    ) : (
                      <button
                        className="w-full cursor-pointer bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                        onClick={() => handleCancelClick(data.id, false)}
                      >
                        Cancel show
                      </button>
                    )}
                    <button
                      onClick={handleAddClick}
                      className="w-full cursor-pointer bg-[#e9ecdf] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                    >
                      Add a poster
                    </button>
                    {addPosterIsHidden == false && (
                      <div className="absolute top-30 -right-63 flex w-60 flex-col rounded-sm border-2 bg-[#e9ecdf] px-1 py-0.5 shadow-sm shadow-black/10">
                        <p className="mb-1 px-0.5">Add a poster</p>
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
                                  className="w-ful mr-0.5 cursor-pointer rounded-md border-[1.5px] border-[#d8d8d7] bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
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
                      className="w-ful cursor-pointer rounded-b-md bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
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
                      {data.name ? (
                        <h2
                          className={`${titleTextSize} text-wrap ${titleWrap}`}
                        >
                          {data.name}: {data.performers}
                        </h2>
                      ) : (
                        <h2
                          className={`${titleTextSize} text-wrap ${titleWrap}`}
                        >
                          {' '}
                          {data.performers}
                        </h2>
                      )}
                    </div>
                    <div className="sm:w-1/2 lg:w-6/9">
                      <div className="mt-4 ml-1">
                        <div className="flex flex-row items-center">
                          <h3 className="text-xl lg:text-2xl">
                            {data.locationName}{' '}
                          </h3>
                          {data.locationCoords && (
                            <span className="ml-2 text-base text-[#6d6c6cca] italic md:text-lg">
                              <a
                                className="wrap-anywhere hover:text-[#9fab7e]"
                                href={`https://www.google.com/maps/@${data.locationCoords}`}
                              >
                                {' '}
                                {data.locationCoords}
                              </a>
                            </span>
                          )}
                        </div>
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
                      {data.ticketsLink && (
                        <div className="mt-2 ml-1 flex flex-row">
                          <p className="text-md lg:text-lg">
                            Online tickets available{' '}
                            <a
                              href={data.ticketsLink}
                              className="text-md underline lg:text-lg"
                            >
                              here
                            </a>{' '}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="basicInfo mt-auto text-lg">
                <div className="flex flex-row">
                  <div className="mt-2 flex w-1/2 flex-col border-2 border-[#dad7c2d0] bg-[#eaeae066] p-2">
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
                    {data.maxCapacity && (
                      <div>
                        <p className="text-[#414141e8]">Max capacity</p>
                        <p className="my-1"> {data.maxCapacity} </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex w-1/2 flex-col border-t-2 border-r-2 border-b-2 border-[#eae7d2ac] p-2 text-right">
                    <p className="text-[#414141e8]">Noise level</p>
                    <p className="my-1">[ {data.noiseLevel} ]</p>
                    <p className="text-[#414141e8]">Bathrooms nearby?</p>
                    <p className="my-1">
                      [ {data.bathroomsNearby ? 'Yes' : 'No'} ]
                    </p>
                    <p className="text-[#414141e8]">Wheelchair access?</p>
                    <p className="my-1">
                      [ {data.wheelchairAccessible ? 'Yes' : 'No'} ]
                    </p>
                    <p className="text-[#414141e8]">Limited mobility access?</p>
                    <p className="my-1">
                      [ {data.mobilityAccessible ? 'Yes' : 'No'} ]
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="posterDiv flex w-1/2 lg:w-fit">
              {posterIsLoading && (
                <div className="flex h-full items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}
              {!posterIsLoading && poster.length == 0 && (
                <img
                  className="block h-[calc(100vh-4rem)] min-w-0 object-contain wrap-break-word whitespace-normal"
                  src={poster[0]?.image}
                  alt={`Poster for ${data.performers}`}
                ></img>
              )}

              {!posterIsLoading && poster.length == 1 && (
                <img
                  className="block h-[calc(100vh-4rem)] min-w-0 object-contain wrap-break-word whitespace-normal"
                  src={poster[0]?.image}
                  alt={`Poster for ${data.performers}`}
                ></img>
              )}
              {!posterIsLoading && poster.length > 1 && (
                <div className="relative">
                  <img
                    className="block h-[calc(100vh-4rem)] min-w-0 object-contain wrap-break-word whitespace-normal"
                    src={
                      poster[currentPosterIndex]?.image ||
                      'Public/assets/defaultPoster.jpg'
                    }
                    alt={`Poster for ${data.performers}`}
                  ></img>
                  <div className="absolute bottom-0 left-0 flex flex-row items-center rounded-r-sm border-t-2 border-r-2 border-b-2 border-[#eae7d2e2] bg-[#dad7c2] opacity-80">
                    <button
                      onClick={prevPoster}
                      className="rounded-sm px-2 py-0.5 text-black"
                    >
                      &#10094;
                    </button>
                    <p>
                      {currentPosterIndex + 1} / {poster.length}
                    </p>
                    <button
                      onClick={nextPoster}
                      className="rounded-sm px-2 py-0.5 text-black"
                    >
                      &#10095;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Toast.Provider>
        </div>
        <div className="my-4 flex w-full justify-center">
          <CommentSection
            comments={comments}
            originIdType={'upcomingShowId'}
            originId={data.id}
            classes=" sm:max-w-3/5 sm:min-w-2/5 rounded-md border-2 border-[#dad7c2d0]"
          />
        </div>
      </div>

      {/* phone size starts */}
      {/* phone
      phone
      phone
      phone
      visualreminder
      thatthis
      is 
      phone 
      phone \
      phone */}
      <div className="phone-screen mb-4 flex flex-col sm:hidden">
        {isAuthenticated &&
          data?.userId == user?.sub &&
          managePosterIsHidden == false && (
            <div className="AlertDialogOverlay mx-auto">
              <div className="ManagePostersContent flex h-fit max-h-5/6 w-4/6 cursor-default flex-wrap items-center justify-center overflow-y-scroll rounded-sm border-2 bg-[#f7f9ef]">
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
                      className="group relative m-2 h-fit w-fit min-w-40 rounded-sm border-[1.5px]"
                    >
                      <div className="flex h-fit max-w-40 min-w-36 flex-col">
                        <img
                          alt={'poster by' + poster.designer}
                          src={poster.image}
                          className="h-full w-full rounded-sm bg-white object-contain"
                        ></img>
                        <button
                          onClick={() => {
                            handleManagePosterClick(poster)
                          }}
                          className="rounded-b-xs bg-[#fe4242] px-1 py-0.5 text-white active:bg-[#f75353]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                {poster.length == 0 && (
                  <div className="flex flex-col items-center justify-center p-2">
                    <p className="mb-1 text-center text-base">
                      This show doesn&apos;t have any posters yet!
                    </p>
                    <img
                      className="h-52 md:h-96"
                      src="/assets/Im-working-on-it.png"
                      alt="Bleb painting a poster"
                    ></img>
                  </div>
                )}
              </div>
            </div>
          )}
        {isAuthenticated &&
          data?.userId == user?.sub &&
          managePosterIsHidden == true && (
            <div>
              {phoneToolsTriggerIsHidden == false && (
                <div className="toolsPhoneTiggerButton absolute top-8 left-2 z-50 w-fit rounded-full border-2 bg-[#ffffff] shadow-lg shadow-black/20">
                  <button
                    onClick={handlePhoneToolsClick}
                    className={`flex min-h-14 min-w-14 flex-row items-center justify-center rounded-full border-b-2 bg-[#d9d7c0]`}
                  >
                    <ToolsSymbol className="h-12" />
                  </button>
                </div>
              )}
              {addPosterIsHidden == false && (
                <div className="PopupOverlay">
                  <div className="PhoneToolsContent text-md absolute top-1/2 left-1/2 z-200 flex w-60 flex-col rounded-sm border-2 bg-[#e9ecdf] px-1 py-0.5 shadow-sm shadow-black/10">
                    <div className="mb-1 flex flex-row justify-between p-0.5">
                      <p className="px-0.5">Add alt poster</p>
                      <button
                        className="shadow-black-20 h-fit rounded-md border bg-[#fa9292] p-1 shadow-md hover:bg-[#f87070] active:bg-[#fa4c4c]"
                        onClick={() => {
                          handlePhoneToolsClick()
                          setAddPosterIsHidden(true)
                        }}
                      >
                        <Cross1Icon />
                      </button>
                    </div>
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
                              className="mr-0.5 w-full rounded-md border-[1.5px] border-[#d8d8d7] bg-[#f7f9ef] px-1 py-0.5 text-left hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2]"
                            >
                              Manage posters
                            </button>
                          </span>
                          tool.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {phoneToolsIsHidden == false && (
                <div className="PopupOverlay">
                  <div
                    className={`PhoneToolsContent absolute top-1/2 left-1/2 z-50 ${toolsHiddenClass} w-3/5 shadow-lg shadow-black/20`}
                  >
                    <div className="flex min-w-40 flex-row items-center justify-between rounded-t-sm border-2 bg-[#d9d7c0] px-1 py-0.5">
                      <div className="flex flex-row items-center justify-center">
                        <ToolsSymbol className="h-10" />
                        <p className="text-xl">Tools</p>
                      </div>
                      <button
                        className="shadow-black-20 h-fit rounded-md border bg-[#fa9292] p-1 shadow-md hover:bg-[#f87070] active:bg-[#fa4c4c]"
                        onClick={handlePhoneToolsClick}
                      >
                        <Cross1Icon />
                      </button>
                    </div>
                    <div className="flex flex-col rounded-b-md border-2 border-t-0">
                      <AlertDialog.Root>
                        <AlertDialog.Trigger asChild>
                          <button
                            onClick={() => setToolsHiddenClass('hidden')}
                            className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
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
                              This cannot be undone. Shows can be canceled
                              instead to alert attendees.
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
                        className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
                      >
                        Edit details
                      </button>
                      {data.canceled ? (
                        <button
                          className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
                          onClick={() => handleCancelClick(data.id, true)}
                        >
                          Uncancel show
                        </button>
                      ) : (
                        <button
                          className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
                          onClick={() => handleCancelClick(data.id, false)}
                        >
                          Cancel show
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleAddClick()
                          setPhoneToolsIsHidden(true)
                        }}
                        className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
                      >
                        Add alt poster
                      </button>

                      <button
                        onClick={handleManageClick}
                        className="w-full rounded-b-md bg-[#f7f9ef] px-1 py-0.5 text-left text-lg active:bg-[#d8d9b2]"
                      >
                        Manage posters
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        {data.canceled == true && (
          <div className="mb-2 w-full bg-[#f97373] px-1.5 py-1">
            <p className="text-center">This show has been canceled</p>
          </div>
        )}
        <div className="titleDiv mb-1 w-full text-center text-3xl">
          {data.name ? (
            <h2 className={`text-wrap ${titleWrap}`}>
              {data.name}: {data.performers}
            </h2>
          ) : (
            <h2 className={`text-wrap ${titleWrap}`}> {data.performers}</h2>
          )}
        </div>
        <div className="mb-1 flex flex-col items-center justify-center text-[#373636]">
          <h3 className="text-md">
            {data.locationName} - {formatDate(data.date)}{' '}
          </h3>
        </div>
        <div className="posterDiv flex h-3/5 w-full items-center justify-center overflow-hidden">
          {posterIsLoading && (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          )}

          {!posterIsLoading && poster.length == 1 && (
            <img
              className="block min-w-0 object-contain wrap-break-word whitespace-normal"
              src={poster[0]?.image}
              alt={`Poster for ${data.performers}`}
            ></img>
          )}
          {!posterIsLoading && poster.length > 1 && (
            <div className="relative">
              <img
                className="flex h-[calc(100vh-14rem)] max-w-[calc(100vw-4rem)] min-w-0 items-center justify-center object-contain wrap-break-word whitespace-normal"
                src={
                  poster[currentPosterIndex]?.image ||
                  'Public/assets/defaultPoster.jpg'
                }
                alt={`Poster for ${data.performers}`}
              ></img>

              <div className="absolute top-1/2 -left-7 flex flex-row items-center rounded-sm border-2 border-[#eae7d2e2] bg-[#dad7c2] pl-1 opacity-70">
                <button
                  onClick={prevPoster}
                  className="rounded-sm px-2 py-1 text-black"
                >
                  &#10094;
                </button>
              </div>
              <div className="absolute top-1/2 -right-7 flex flex-row items-center rounded-sm border-2 border-[#eae7d2e2] bg-[#dad7c2] pr-1 opacity-70">
                <button
                  onClick={nextPoster}
                  className="rounded-sm px-2 py-1 text-black"
                >
                  &#10095;
                </button>
              </div>
            </div>
          )}
        </div>
        {data.description && (
          <div className="w-full px-4 pt-3 pb-1">
            <div className="rounded-md border-2 border-[#dad7c21a] bg-[#f1f1e91a] p-2 text-pretty">
              <p className="opacity-100">{data.description}</p>
            </div>
          </div>
        )}

        <div className="basicInfo text-md mr-1 ml-1">
          <div className="flex flex-row">
            <div className="mt-2 flex w-1/2 flex-col border-2 border-[#dad7c2d0] bg-[#eaeae066] p-2">
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
              <p className="text-[#414141e8]">Max capacity</p>
              <p className="my-1"> {data.maxCapacity} </p>
            </div>
            <div className="mt-2 flex w-1/2 flex-col border-t-2 border-r-2 border-b-2 border-[#eae7d2ac] p-2 text-right">
              <p className="text-[#414141e8]">Noise level</p>
              <p className="my-1">[ {data.noiseLevel} ]</p>
              <p className="text-[#414141e8]">Bathrooms nearby?</p>
              <p className="my-1">[ {data.bathroomsNearby ? 'Yes' : 'No'} ]</p>
              <p className="text-[#414141e8]">Wheelchair access?</p>
              <p className="my-1">
                [ {data.wheelchairAccessible ? 'Yes' : 'No'} ]
              </p>
              <p className="text-[#414141e8]">Limited mobility access?</p>
              <p className="my-1">
                [ {data.mobilityAccessible ? 'Yes' : 'No'} ]
              </p>
            </div>
          </div>
        </div>
        {data.locationCoords && data.ticketsLink && (
          <div className="action buttons mt-2 flex w-screen items-center justify-between px-2 py-1">
            <div className="flex w-1/2 items-center justify-center">
              <a
                href={`${data.ticketsLink}`}
                className="mx-0.5 w-full rounded-md border-2 border-[#eae7d2e2] bg-[#e0dfbd8d] px-1 py-1.5 text-center hover:bg-[#ebead5af] active:bg-[#e0dfbd8d]"
              >
                Buy tickets online
              </a>
            </div>
            <div className="mx-0.5 flex w-1/2 items-center justify-center text-center">
              <a
                href={`https://www.google.com/maps/@${data.locationCoords}`}
                className="w-full rounded-sm border-2 border-[#eae7d2e2] bg-[#eae7d2ac] px-1 py-1.5 text-center hover:bg-[#ebead5af] active:bg-[#e0dfbd8d]"
              >
                Show Coordinates
              </a>
            </div>
          </div>
        )}
        {data.locationCoords && !data.ticketsLink && (
          <div className="action buttons mt-2 flex w-screen items-center justify-center px-2 py-1">
            <a
              href={data.ticketsLink}
              className="mx-0.5 w-full rounded-md border-2 border-[#eae7d2e2] bg-[#e0dfbd8d] px-1 py-1.5 text-center active:bg-[#e3e1a9]"
            >
              Buy tickets online
            </a>
          </div>
        )}
        {data.ticketsLink && !data.locationCoords && (
          <div className="action buttons mt-2 flex w-screen items-center justify-center px-2 py-1">
            <a
              href={`https://www.google.com/maps/@${data.locationCoords}`}
              className="w-full rounded-sm border-2 border-[#eae7d2e2] bg-[#eae7d2ac] px-1 py-1.5 text-center active:bg-[#e3e1a9]"
            >
              Show Coordinates
            </a>
          </div>
        )}
        <div className="mx-2">
          <CommentSection
            comments={comments}
            originIdType={'upcomingShowId'}
            originId={data.id}
          />
        </div>
      </div>
    </div>
  )
}
