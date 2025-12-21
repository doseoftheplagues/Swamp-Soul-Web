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
      uploadSuccess(data.url)
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
      <form className="flex flex-row">
        <label htmlFor="image" className="sr-only">
          File
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-[100px] text-sm text-gray-500 file:mr-4 file:border-0 file:bg-[#ffffff] file:px-2 file:py-1 file:text-sm file:text-black hover:file:bg-[#c9c7b576] active:file:bg-[#c9c7b5e1]"
        />
        {file && (
          <div>
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file}
              className="ml-2 block w-[100px] rounded-xs border-[1.5px] bg-[#ead2d2be] px-2 py-1 text-sm text-black hover:bg-[#e1bebef5] active:bg-[#e1bebe]"
            >
              Upload
            </button>
          </div>
        )}
      </form>
    </div>
  )
}
