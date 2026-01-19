import request from 'superagent'
import { UpcomingShowData } from '../../models/upcomingShow'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUpcomingShows() {
  const response = await request.get(`${rootURL}/upcomingshows`)
  return response.body.upcomingShows
}

export async function getUpcomingShowById(id: number) {
  const response = await request.get(`${rootURL}/upcomingshows/${id}`)
  return response.body
}

export async function getUpcomingShowsByUserId(id: string) {
  const response = await request.get(`${rootURL}/upcomingshows/user/${id}`)
  return response.body
}

export async function updateUpcomingShow(
  id: number,
  showData: Partial<UpcomingShowData>,
  token: string,
) {
  const response = await request
    .patch(`${rootURL}/upcomingshows/${id}`)
    .send(showData)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}

export async function addUpcomingShow(
  showData: UpcomingShowData,
  token: string,
) {
  const response = await request
    .post(`${rootURL}/upcomingshows`)
    .send(showData)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}

export async function deleteUpcomingShow(id: number, token: string) {
  const response = await request
    .delete(`${rootURL}/upcomingshows/${id}`)
    .set('Authorization', `Bearer ${token}`)
  return response.body
}
