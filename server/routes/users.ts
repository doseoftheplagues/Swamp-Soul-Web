import { Router } from 'express'
import checkJwt from '../../auth0.ts'
import { JwtRequest } from '../../auth0.ts'

import * as db from '../db/users.ts'

const router = Router()

// GET localhost:3000/api/v1/users
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const auth0Id = req.auth?.sub
    const user = await db.getUserById(auth0Id as string)
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const newUser = req.body
    const auth0Id = req.auth?.sub

    const [user] = await db.addUser({
      ...newUser,
      auth0Id,
    })
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong getting shows' })
  }
})

export default router
