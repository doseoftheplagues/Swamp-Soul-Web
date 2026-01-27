import express from 'express'
import * as db from '../db/adminMessages.js'
import * as userDb from '../db/users.js'
import { NewAdminMessage } from '../../models/adminMessage.ts'
import checkJwt, { JwtRequest } from '../../auth0.ts'

const router = express.Router()

// GET /api/v1/adminmessages/user/:userId
router.get('/user/:userId', checkJwt, async (req: JwtRequest, res) => {
  const userId = req.params.userId
  const authId = req.auth?.sub

  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const user = await userDb.getUserById(authId)
    if (!user.admin && authId !== userId) {
      return res.status(403).json({
        message:
          'Forbidden: You do not have permission to view these messages.',
      })
    }

    const messages = await db.getAdminMessagesByUserId(userId)
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// GET /api/v1/adminmessages (admin only)
router.get('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const user = await userDb.getUserById(authId)
    if (!user.admin) {
      return res.status(403).json({
        message: 'Forbidden: You must be an admin to perform this action.',
      })
    }

    const messages = await db.getAllAdminMessages()
    res.json(messages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// POST /api/v1/adminmessages (admin only)
router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const newMessageData: Omit<NewAdminMessage, 'adminId'> = req.body

  try {
    const user = await userDb.getUserById(authId)
    if (!user.admin) {
      return res.status(403).json({
        message: 'Forbidden: You must be an admin to perform this action.',
      })
    }

    const newMessage: NewAdminMessage = {
      ...newMessageData,
      adminId: authId,
    }

    const message = await db.addAdminMessage(newMessage)
    res.status(201).json(message)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// DELETE /api/v1/adminmessages/:id
router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const id = Number(req.params.id)
  try {
    const deleted = await db.deleteAdminMessage(id)
    if (deleted) {
      res.sendStatus(200)
    } else {
      res.status(404).json({ message: 'Message not found' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
