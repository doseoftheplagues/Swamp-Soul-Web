import { useState } from 'react'
import { uploadImage } from '../../apis/upload'

export function FileUploader() {
  const [formData, setFormData] = useState({ image: null })
  const uploadFunct = () => {
    if (formData == null) {
      return
    }
    uploadImage(formData)
  }

  return (
    <div>
      <form>
        <label htmlFor="image" className="sr-only">
          File
        </label>
        <input type="file" className="p-1" />
      </form>
    </div>
  )
}
