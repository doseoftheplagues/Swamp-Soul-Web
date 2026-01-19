import { ChangeEvent, useState } from 'react'
import { uploadImage } from '../../apis/upload'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UploadImageVariables {
  file: File
  token: string
}

interface FileUploaderProps {
  uploadSuccess: (fileUrl: string, designer: string) => void
  currentNumberOfPosters: number
}

export function PosterUploader({
  uploadSuccess,
  currentNumberOfPosters,
}: FileUploaderProps) {
  const queryClient = useQueryClient()
  const [designer, setDesigner] = useState('')
  const { getAccessTokenSilently } = useAuth0()
  const [file, setFile] = useState<File | null>(null)
  const [fileIsUploading, setFileIsUploading] = useState(false)

  const imageUploadMutation = useMutation({
    mutationFn: ({ file, token }: UploadImageVariables) =>
      uploadImage(file, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['imageUpload'],
      })
      setFileIsUploading(false)
      uploadSuccess(data.url, designer)
    },
    onError: (error) => {
      console.error('Image upload failed:', error)
    },
  })

  const handleUpload = async () => {
    console.log('handleUpload started...')
    const token = await getAccessTokenSilently()
    if (file == null) {
      console.log('Image upload failed, no image found')
      return
    } else {
      setFileIsUploading(true)
      imageUploadMutation.mutate({ file, token })
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  if (currentNumberOfPosters < 5) {
    return (
      <div>
        <form className="flex flex-col">
          <label htmlFor="designer" className="mb-0.5 text-sm">
            Designer:
          </label>
          <input
            type="text"
            name="designer"
            id="designer"
            className="mb-2 rounded-sm px-1 py-0.5"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          ></input>
          <label htmlFor="image" className="text-sm">
            Poster:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="max-w file:text-md mb-1 w-[102px] rounded-sm px-1"
          />
          {file && (
            <div className="p-0.5 text-sm">
              <p className="mb-1">Selected: {file.name}</p>
              <button
                type="button"
                className="rounded-xs border-2 bg-[#dad7c267] px-1 py-0.5 text-sm hover:bg-[#dad7c2c0] disabled:bg-[#bebebd99] disabled:text-[#aca7a7a9]"
                id="upload"
                onClick={handleUpload}
                disabled={designer.trim() === '' || fileIsUploading == true}
              >
                Upload
              </button>
            </div>
          )}
        </form>
      </div>
    )
  } else {
    return (
      <div className="rounded-sm border border-[#dbd7cf] bg-[#f7f9ef] px-1 py-0.5">
        <p>This show has hit the 5 poster limit.</p>
      </div>
    )
  }
}
