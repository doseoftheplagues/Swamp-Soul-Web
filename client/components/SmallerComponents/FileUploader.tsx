import { ChangeEvent, useState } from 'react'
import { uploadImage } from '../../apis/upload'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UploadImageVariables {
  file: File
  token: string
}

interface FileUploaderProps {
  uploadSuccess: (fileUrl: string) => void
}

export function FileUploader({ uploadSuccess }: FileUploaderProps) {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()
  const [file, setFile] = useState<File | null>(null)

  const imageUploadMutation = useMutation({
    mutationFn: ({ file, token }: UploadImageVariables) =>
      uploadImage(file, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['imageUpload'],
      })
      uploadSuccess(data.image)
    },
  })

  const handleUpload = async () => {
    const token = await getAccessTokenSilently()
    if (file == null) {
      console.log('Image upload failed, no image found')
      return
    } else {
      imageUploadMutation.mutate({ file, token })
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div>
      <form>
        <label htmlFor="image" className="sr-only">
          File
        </label>
        <input type="file" onChange={handleFileChange} className="p-1" />
        {file && (
          <div>
            <p>Filename: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)}</p>
            <p>Type: {file.type}</p>
            <button onClick={handleUpload}>Upload</button>
          </div>
        )}
      </form>
    </div>
  )
}
