import request from 'superagent'
import { UpcomingShow, UpcomingShowData } from '../../models/upcomingShow'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUpcomingShows() {
  const response = await request.get(`${rootURL}/upcomingshows`)
  return response.body.upcomingShows
}

export async function getUpcomingShowById(id: number) {
  const response = await request.get(`${rootURL}/upcomingshows/${id}`)
  return response.body
}

export async function updateUpcomingShow(
  id: number,
  showData: UpcomingShowData,
) {
  const response = await request
    .patch(`${rootURL}/upcomingshows/${id}`)
    .send(showData)
  return response.body
}

export async function addUpcomingShow(showData: UpcomingShowData) {
  const response = await request.post(`${rootURL}/upcomingshows`).send(showData)
  return response.body
}

export async function deleteUpcomingShow(id: number) {
  const response = await request.delete(`${rootURL}/upcomingshows/${id}`)
  return response.body
}
