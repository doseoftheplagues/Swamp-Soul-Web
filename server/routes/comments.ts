import { Router } from 'express'

const router = Router()
import * as db from '../db/comments.ts'
// import checkJwt from '../../auth0.ts'

// GET /api/v1/comments/upcomingshow/:showid

router.get('/upcomingshow/:showid', async (req, res) => {
  const showId = Number(req.params.showid)
  const associatedComments = await db.getCommentsByUpcomingShowId(showId)
  res.json(associatedComments)
})

export default router
