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

export function PosterUploader({ uploadSuccess }: FileUploaderProps) {
  const queryClient = useQueryClient()
  const [designer, setDesigner] = useState('')
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
      <form className="flex w-2/6 flex-col">
        <label htmlFor="designer">Designer:</label>
        <input
          type="text"
          name="designer"
          id="designer"
          value={designer}
          onChange={(e) => setDesigner(e.target.value)}
        ></input>
        <label htmlFor="image" className="sr-only">
          Poster
        </label>
        <input type="file" onChange={handleFileChange} className="p-1" />
        {file && (
          <div>
            <p>Filename: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)}</p>
            <p>Type: {file.type}</p>
            <button
              className="rounded-xs border-2 bg-[#dad7c267] px-1 py-0.5 text-sm hover:bg-[#dad7c2c0] disabled:bg-[#bebebd99] disabled:text-[#aca7a7a9]"
              id="upload"
              onClick={handleUpload}
              disabled={designer.trim() === ''}
            >
              Upload
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
