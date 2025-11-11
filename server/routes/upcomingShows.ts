import { Router } from 'express'
import * as db from '../db/upcomingShows.ts'

const router = Router()

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

router.post('/', async (req, res) => {
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

router.patch('/:id', async (req, res) => {
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

export default router
