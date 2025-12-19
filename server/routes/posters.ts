import { Router } from 'express'
// import checkJwt from '../../auth0'

const router = Router()
import * as db from '../db/posters.ts'
import checkJwt from '../../auth0.ts'

// GET /api/v1/posters/upcomingshow/:showid

router.get('/upcomingshow/:showid', async (req, res) => {
  const showId = Number(req.params.showid)
  const associatedPosters = await db.getPostersByUpcomingShowId(showId)
  res.json(associatedPosters)
})

// GET /api/v1/posters/archiveshow/:showid

router.get('/archiveshow/:showid', async (req, res) => {
  const showId = Number(req.params.showid)
  const associatedPosters = await db.getPostersByArchiveShowId(showId)
  res.json(associatedPosters)
})

// POST /api/v1/posters

router.post('/', checkJwt, async (req, res) => {
  try {
    const posterData = req.body
    const posterAdded = await db.addPoster(posterData)
    res.status(201).json(posterAdded)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong adding poster' })
  }
})

// DELETE /api/v1/posters

router.delete('/:id', async (req, res) => {
  try {
    const posterId = Number(req.params.id)
    const posterDeleted = await db.deletePoster(posterId)
    res.status(200).json(posterDeleted)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong deleting poster' })
  }
})

export default router
