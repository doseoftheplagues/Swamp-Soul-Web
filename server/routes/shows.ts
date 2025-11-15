import { Router } from 'express'

import * as db from '../db/shows.ts'

// At the top of server/routes/shows.ts

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
    // 1. Get the flat data from the DB
    const flatShows: ShowDbRow[] = await db.getAllShows()

    // 2. Transform it into grouped data
    const groupedShows = groupShows(flatShows)

    // 3. Send the correctly structured data to the client
    res.json({ shows: groupedShows })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
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
