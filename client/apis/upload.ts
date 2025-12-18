import request from 'superagent'

const rootURL = new URL(`/api/v1/upload`, document.baseURI)

interface ImageUrl {
  image: string
}

export async function uploadImage(
  image: File,
  token: string,
): Promise<ImageUrl> {
  const formData = new FormData()
  formData.append('image', image)

  const response = await request
    .post(rootURL)
    .send(formData)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
