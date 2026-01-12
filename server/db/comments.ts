import { Comment } from '../../models/comment.ts'
import connection from './connection.ts'

const db = connection

const commentProperties = [
  'comments.id as id',
  'comments.user_id as userId',
  'comments.upcoming_show_id as upcomingShowId',
  'comments.archive_show_id as archiveShowId',
  'comments.post_id as postId',
  'comments.date_added as dateAdded',
  'comments.content',
  'comments.parent',
  'posts.user_id as postAuthorId',
]

// GET

export async function getCommentsByUpcomingShowId(showId: number) {
  return db('comments')
    .leftJoin('posts', 'comments.post_id', 'posts.id')
    .where('upcoming_show_id', showId)
    .select(...commentProperties)
}
export async function getCommentsByArchiveShowId(showId: number) {
  return db('comments')
    .leftJoin('posts', 'comments.post_id', 'posts.id')
    .where('archive_show_id', showId)
    .select(...commentProperties)
}
export async function getCommentsByPostId(postId: number) {
  return db('comments')
    .leftJoin('posts', 'comments.post_id', 'posts.id')
    .where('post_id', postId)
    .select(...commentProperties)
}
export async function getCommentsByParentId(parentId: number) {
  return db('comments')
    .leftJoin('posts', 'comments.post_id', 'posts.id')
    .where('parent', parentId)
    .select(...commentProperties)
}

export async function getCommentsByUserId(userId: string) {
  const userComments = await db('comments')
    .leftJoin('posts', 'comments.post_id', 'posts.id')
    .where('comments.user_id', userId)
    .select(...commentProperties)

  const userCommentIds = userComments.map((c) => c.id)

  const repliesToUser = userCommentIds.length
    ? await db('comments')
        .leftJoin('posts', 'comments.post_id', 'posts.id')
        .whereIn('parent', userCommentIds)
        .select(...commentProperties)
    : []

  const allComments = [...userComments, ...repliesToUser]
  const uniqueComments = Array.from(
    new Map(allComments.map((c) => [c.id, c])).values(),
  )

  return uniqueComments
}

//POST

export async function addComment(commentData: Comment) {
  const { upcomingShowId, archiveShowId, postId, userId, content, parent } =
    commentData
  const [result] = await db('comments').insert({
    upcoming_show_id: upcomingShowId,
    archive_show_id: archiveShowId,
    post_id: postId,
    user_id: userId,
    content,
    parent,
  })
  return result
}

//DELETE

export async function deleteComment(commentId: number, authId?: string) {
  const query = db('comments').where('id', commentId)

  if (authId) {
    query.where('user_id', authId)
  }

  return query.delete()
}
