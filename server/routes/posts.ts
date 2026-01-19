import { Router } from 'express'
import * as db from '../db/posts.ts'
import * as userDb from '../db/users.ts'
import checkJwt, { JwtRequest } from '../../auth0.ts'

const router = Router()

// GET /api/v1/posts/user/:userid
router.get('/user/:userid', async (req, res) => {
  try {
    const userId = req.params.userid
    const associatedPosts = await db.getPostsByUserId(userId)
    res.json(associatedPosts)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong fetching user posts' })
  }
})

// GET /api/v1/posts/:postid
router.get('/:postid', async (req, res) => {
  try {
    const postId = Number(req.params.postid)
    const post = await db.getPostById(postId)
    res.json(post)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong fetching post' })
  }
})

// POST /api/v1/posts/
router.post('/', checkJwt, async (req: JwtRequest, res) => {
  try {
    const postData = req.body
    const authId = req.auth?.sub

    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (postData.userId !== authId) {
      return res.status(403).json({
        message: 'Forbidden: You can only create posts for your own user ID.',
      })
    }

    const result = await db.addPost(postData)
    res.status(201).json(result)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong posting post' })
  }
})

// PUT /api/v1/posts/:postid
router.put('/:postid', checkJwt, async (req: JwtRequest, res) => {
  try {
    const postId = Number(req.params.postid)
    const postData = req.body
    const authId = req.auth?.sub

    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const existingPost = await db.getPostById(postId)
    if (existingPost.userId !== authId) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to update this post.',
      })
    }

    await db.updatePost(postId, postData)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong updating post' })
  }
})

// DELETE /api/v1/posts/:postid
router.delete('/:postid', checkJwt, async (req: JwtRequest, res) => {
  try {
    const postId = Number(req.params.postid)
    const authId = req.auth?.sub

    if (!authId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = await userDb.getUserById(authId)
    const post = await db.getPostById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    let rowsDeleted = 0

    if ((user && user.admin) || post.userId === authId) {
      rowsDeleted = await db.deletePostById(postId)
    } else {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to delete this post.',
      })
    }

    if (rowsDeleted === 0) {
      return res.status(403).json({
        message: 'Forbidden: You do not have permission to delete this post.',
      })
    }
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Something went wrong deleting post' })
  }
})

export default router
