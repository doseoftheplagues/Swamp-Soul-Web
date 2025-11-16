import { Router } from 'express'
import * as db from '../db/upcomingShows.ts'
import checkJwt from '../../auth0.ts'

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

// POST localhost:3000/api/v1/upcomingShows
router.post('/', checkJwt, async (req, res) => {
  try {
    const showData = req.body
    await db.addUpcomingShow(showData)
    res.sendStatus(201)
    console.log('added' + showData)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong posting show' })
  }
})

// PATCH localhost:3000/api/v1/upcomingShows/:id
router.patch('/:id', checkJwt, async (req, res) => {
  try {
    const showData = req.body
    const showId = Number(req.params.id)
    await db.updateUpcomingShow(showId, showData)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong updating show' })
  }
})

// DELETE localhost:3000/api/v1/upcomingShows/:id
router.delete('/:id', checkJwt, async (req, res) => {
  try {
    const showId = Number(req.params.id)
    await db.deleteUpcomingShow(showId)
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong deleting show' })
  }
})

export default router
