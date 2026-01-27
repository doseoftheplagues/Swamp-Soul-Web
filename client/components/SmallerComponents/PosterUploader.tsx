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
      <div className="mt-5 flex items-center justify-center">
        <form className="flex w-fit flex-col items-start justify-start gap-2 rounded-md border-[1.5px] bg-[#dad7c267] p-5 shadow-lg">
          <label htmlFor="designer" className="mb-0.5 text-sm">
            Designer:
          </label>
          <input
            type="text"
            name="designer"
            id="designer"
            className="mb-2 rounded-sm px-1 py-0.5 sm:max-w-sm"
            value={designer}
            onChange={(e) => setDesigner(e.target.value)}
          ></input>
          <label htmlFor="image" className="text-sm">
            Poster:
          </label>

          <input
            type="file"
            onChange={handleFileChange}
            className="max-w file:text-md mb-1 w-[102px] rounded-sm px-1 file:hover:bg-[#dad7c2c0]"
          />

          {file && (
            <div className="flex flex-col items-start justify-start text-sm">
              <p className="mb-1">Selected: {file.name}</p>
              <button
                type="button"
                className="rounded-sm border-[1.5px] bg-[#f8f8ef] px-1 py-0 text-base hover:bg-[#dad7c2c0] disabled:bg-[#bebebd99] disabled:text-[#aca7a7a9]"
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
