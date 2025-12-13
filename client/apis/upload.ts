import request from 'superagent'
import { ImageUpload } from '../../models/imageUpload'

const rootURL = new URL(`/api/v1/upload`, document.baseURI)

export async function uploadImage(formData: ImageUpload) {
  const response = await request.post(rootURL).send(formData)
  return response.body
}
