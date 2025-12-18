import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router'
import { useGetUpcomingShowById } from '../hooks/useUpcomingShows'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { FileUploader } from './SmallerComponents/FileUploader'
import { useState } from 'react'

function AddPosterToShow() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  //check if user is logged in
  const { isAuthenticated, user } = useAuth0()
  // get show by useparams .id
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))

  // onSubmit send patch request to show to update image

  // check if show.userId matches user.sub (prevent edits of shows user doesn't own)
  // if user authenticated and sub matches id display fileuploader
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

  const handleImageUrlReceived = (url: string) => {
    console.log('Image uploaded successfully! URL:', url)
    setUploadedImageUrl(url)
    // call useEditShow hook
    // update image with uploadedImageUrl
  }

  if (isAuthenticated && user?.sub === data.userId)
    return (
      <div>
        <div className="mx-auto max-w-lg p-4 text-center">
          <h1 className="mb-5">
            Step 2: Upload poster to {data.performers} - {formatDate(data.date)}
          </h1>
          <FileUploader uploadSuccess={handleImageUrlReceived} />
        </div>
      </div>
    )
}

export default AddPosterToShow
