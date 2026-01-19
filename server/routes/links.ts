import { Router } from 'express'
import * as db from '../db/links.ts'
import checkJwt, { JwtRequest } from '../../auth0.ts'

const router = Router()

// GET /api/v1/links
router.get('/', async (req, res) => {
  try {
    const links = await db.getLinks()
    res.json(links)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// POST /api/v1/links
router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const { title, link, upcoming_show_id, post_id } = req.body
  const authId = req.auth?.sub

  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const newLink = await db.addLink({
      title,
      link,
      user_id: authId,
      upcoming_show_id,
      post_id,
    })
    res.status(201).json(newLink)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// DELETE /api/v1/links/:id
router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  const linkId = Number(req.params.id)
  const authId = req.auth?.sub

  if (!authId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    await db.deleteLink(linkId, authId)
    res.sendStatus(204)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
