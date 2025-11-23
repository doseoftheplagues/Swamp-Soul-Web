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
    res.status(500).json({ message: 'Something went wrong getting user' })
  }
})

// get localhost:3000/api/v1/users/check-username/:username
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params
    const isTaken = await db.usernameTakenCheck(username)
    res.json({ isTaken: isTaken })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong checking username' })
  }
})
// get localhost:3000/api/v1/users/edit-user/:username
router.patch('/edit-user/:id', async (req, res) => {
  try {
    const userData = req.body
    const id = req.params.id
    await db.editUser(userData, id)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500).json({ message: 'Something went wrong updating user' })
  }
})

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const newUser = req.body
    const auth0Id = req.auth?.sub

    const [user] = await db.addUser({
      ...newUser,
      authId: auth0Id,
    })
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong with users' })
  }
})

export default router
