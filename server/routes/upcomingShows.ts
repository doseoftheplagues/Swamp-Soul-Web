import { Router } from 'express'
import * as db from '../db/upcomingShows.ts'
import checkJwt, { JwtRequest } from '../../auth0.ts'

const router = Router()

// GET localhost:3000/api/v1/upcomingShows
router.get('/', async (req, res) => {
  try {
    const upcomingShows = await db.getUpcomingShows()
    console.log(upcomingShows)
    res.json({ upcomingShows })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const showById = await db.getUpcomingShowById(id)
    res.json(showById)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting show' })
  }
})

router.get('/user/:id', async (req, res) => {
  try {
    const id = req.params.id
    const showById = await db.getUpcomingShowsByUserId(id)
    res.json(showById)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting show' })
  }
})

// POST localhost:3000/api/v1/upcomingShows
router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const showData = req.body
    const userId = req.auth?.sub

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Authentication error: User ID not found' })
    }

    const newShowData = {
      ...showData,
      userId: userId,
    }

    const newShow = await db.addUpcomingShow(newShowData)
    res.status(201).json(newShow)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong posting show' })
  }
})

// PATCH localhost:3000/api/v1/upcomingShows/:id
router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const showData = req.body
    const showId = Number(req.params.id)
    const authId = req.auth?.sub
    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    await db.updateUpcomingShow(showId, showData)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong updating show' })
  }
})

// DELETE localhost:3000/api/v1/upcomingShows/:id
router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  try {
    const showId = Number(req.params.id)
    const authId = req.auth?.sub

    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const rowsDeleted = await db.deleteUpcomingShow(showId, authId)

    if (rowsDeleted === 0) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: You can only delete your own shows.' })
    }

    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong deleting show' })
  }
})

export default router
