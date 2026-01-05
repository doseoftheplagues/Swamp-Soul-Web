import { Router } from 'express'
import * as db from '../db/comments.ts'
import * as userDb from '../db/users.ts'
import checkJwt, { JwtRequest } from '../../auth0.ts'

const router = Router()

// GET /api/v1/comments/upcomingshow/:showid

router.get('/upcomingshow/:showid', async (req, res) => {
  const showId = Number(req.params.showid)
  const associatedComments = await db.getCommentsByUpcomingShowId(showId)
  res.json(associatedComments)
})

// GET /api/v1/comments/archive/:showid

router.get('/archive/:showid', async (req, res) => {
  const showId = Number(req.params.showid)
  const associatedComments = await db.getCommentsByArchiveShowId(showId)
  res.json(associatedComments)
})

// GET /api/v1/comments/posts/:postid

router.get('/posts/:postid', async (req, res) => {
  const postId = Number(req.params.postid)
  const associatedComments = await db.getCommentsByPostId(postId)
  res.json(associatedComments)
})

// GET /api/v1/comments/parent/:parentid

router.get('/parent/:parentid', async (req, res) => {
  const parentId = Number(req.params.parentid)
  const associatedComments = await db.getCommentsByParentId(parentId)
  res.json(associatedComments)
})

// GET /api/v1/comments/user/:userid
router.get('/user/:userid', async (req, res) => {
  try {
    const userId = req.params.userid
    const associatedComments = await db.getCommentsByUserId(userId)
    res.json(associatedComments)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong fetching user comments' })
  }
})

// POST /api/v1/comments/

router.post('/', checkJwt, async (req, res) => {
  try {
    const commentData = req.body
    const result = await db.addComment(commentData)
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong posting comment' })
  }
})

// DELETE /api/v1/comments/:commentid

router.delete('/:commentid', checkJwt, async (req: JwtRequest, res) => {
  try {
    const commentId = Number(req.params.commentid)
    const authId = req.auth?.sub

    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await userDb.getUserById(authId)
    let rowsDeleted = 0

    if (user && user.admin) {
      rowsDeleted = await db.deleteComment(commentId)
    } else {
      rowsDeleted = await db.deleteComment(commentId, authId)
    }

    if (rowsDeleted === 0) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to delete this comment.',
      })
    }
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong deleting comment' })
  }
})

export default router
