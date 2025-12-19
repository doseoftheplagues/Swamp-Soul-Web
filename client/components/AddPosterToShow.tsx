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
    archiveShowId: number | null
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
    return <p>Meow</p>
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
          archiveShowId: null,
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
      <div>
        <div className="mx-auto max-w-lg p-4 text-center">
          <h1 className="mb-5">
            Step 2: Upload poster to {data.performers} - {formatDate(data.date)}
          </h1>
          <PosterUploader uploadSuccess={handleImageUrlReceived} />
        </div>
      </div>
    )
}

export default AddPosterToShow
