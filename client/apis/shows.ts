import request from 'superagent'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getShows() {
  const response = await request.get(`${rootURL}/shows`)
  return response.body
}
