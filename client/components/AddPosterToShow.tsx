import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate, useParams } from 'react-router'
import {
  useGetUpcomingShowById,
  useUpdateUpcomingShow,
} from '../hooks/useUpcomingShows'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { PosterUploader } from './SmallerComponents/PosterUploader'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPoster } from '../apis/posters'

interface PosterVariables {
  posterData: {
    image: string
    designer: string
    upcomingShowId: number
  }
  token: string
}

function AddPosterToShow() {
  const queryClient = useQueryClient()
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const navigate = useNavigate()
  // get show by useparams .id
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const editShowMutation = useUpdateUpcomingShow()

  const posterUploadMutation = useMutation({
    mutationFn: ({ posterData, token }: PosterVariables) =>
      addPoster(posterData, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['posters'] }),
  })

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (isLoading) {
    console.log('loading!')
    return <LoadingSpinner />
  }

  if (isError) {
    return <p>An error occured :(</p>
  }
  //check if user is logged in
  // check if show.userId matches user.sub (prevent edits of shows user doesn't own)
  // if user authenticated and sub matches id display fileuploader

  if (!isAuthenticated) {
    console.log(data.performers + '= data performers')
    return <p>Log in to edit or add posters to shows</p>
  }
  if (!data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] p-10 md:p-80">
        <p>
          It&apos;s honestly impressive that you managed to get here. I *think
          you can only do it is by making a show and deleting it straight away,
          which is like, why did you do that?? Did you fuck up the upload form
          that badly? I don&apos;t know why anyone would ever do that. Take
          pride in the fact that you are unpredictable and go forth into this
          world with the knowledge that you are not a normal swampsoul.org user.
          You have broken the mold. I believe in you.
        </p>
      </div>
    )
  }

  if (isAuthenticated && user?.sub != data.userId) {
    console.log(user?.sub + '= usersub')
    return (
      <p>You do not have permission to edit this show or add posters to it</p>
    )
  }

  const handleImageUrlReceived = async (url: string, designer: string) => {
    try {
      console.log('Image uploaded successfully! URL:', url)
      const token = await getAccessTokenSilently()
      const upcomingShowId = Number(params.id)
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
      navigate(`/upcomingshows/${upcomingShowId}`)
    } catch (error) {
      console.error('Something went wrong', error)
    }
  }

  if (isAuthenticated && user?.sub === data.userId)
    return (
      <div className="min-h-[calc(100vh-4rem)] w-full">
        <div className="block max-w-lg p-4 text-center sm:m-auto">
          <h1 className="mb-5">
            Upload poster to {data.performers} - {formatDate(data.date)}
          </h1>
          <PosterUploader
            uploadSuccess={handleImageUrlReceived}
            currentNumberOfPosters={0}
          />
        </div>
      </div>
    )
}

export default AddPosterToShow
