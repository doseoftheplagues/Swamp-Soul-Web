import request from 'superagent'
import { UpcomingPosterData } from '../../models/poster'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getPostersByUpcomingShowId(id: number) {
  const response = await request.get(`${rootURL}/posters/upcomingshow/${id}`)
  return response.body
}
export async function getPostersByArchiveShowId(id: number) {
  const response = await request.get(`${rootURL}/posters/archiveshow/${id}`)
  return response.body
}

export async function addPoster(posterData: UpcomingPosterData, token: string) {
  const response = await request
    .post(`${rootURL}/posters`)
    .send(posterData)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
