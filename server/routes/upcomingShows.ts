import { Router } from 'express'

import * as db from '../db/shows.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
  }
})

export default router
