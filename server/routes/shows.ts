import { Router } from 'express'
// import checkJwt, { JwtRequest } from '../../auth0.ts'

import * as db from '../db/shows.ts'
import checkJwt from '../../auth0.ts'

interface ShowDbRow {
  showId: number
  performers: string
  date: string
  location: string
  posterId: number
  image: string
  designer: string
}

interface Poster {
  id: number
  image: string
  designer: string
}

interface Show {
  id: number
  performers: string
  date: string
  location: string
  posters: Poster[]
}

const router = Router()

router.get('/', async (req, res) => {
  try {
    // get flat data from the DB
    const flatShows: ShowDbRow[] = await db.getAllShows()

    // group it
    const groupedShows = groupShows(flatShows)

    // send the correctly structured data
    res.json({ shows: groupedShows })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
  }
})

router.post('/', checkJwt, async (req, res) => {
  try {
    const requestData = req.body
    const showData = requestData.showData
    const posterData = requestData.posterData
    const postedShow = db.addShowWithPoster(showData, posterData)
    res.json(postedShow)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: 'something went wrong posting show to archive' })
  }
})

function groupShows(flatShows: ShowDbRow[]): Show[] {
  const showsById = new Map<number, Show>()

  flatShows.forEach((row) => {
    const { showId, performers, date, location, posterId, image, designer } =
      row

    const poster: Poster = { id: posterId, image, designer }
    if (!showsById.has(showId)) {
      showsById.set(showId, {
        id: showId,
        performers,
        date,
        location,
        posters: [],
      })
    }
    showsById.get(showId)?.posters.push(poster)
  })
  return Array.from(showsById.values())
}

export default router
