import { Comment } from '../../models/comment.ts'
import connection from './connection.ts'

const db = connection

const commentProperties = [
  'id',
  'user_id as userId',
  'upcoming_show_id as upcomingShowId',
  'archive_show_id as archiveShowId',
  'date_added as dateAdded',
  'content',
  'parent',
]

// GET

export async function getCommentsByUpcomingShowId(showId: number) {
  return db('comments')
    .where('upcoming_show_id', showId)
    .select(...commentProperties)
}
export async function getCommentsByArchiveShowId(showId: number) {
  return db('comments')
    .where('archive_show_id', showId)
    .select(...commentProperties)
}
export async function getCommentsByPostId(postId: number) {
  return db('comments')
    .where('post_id', postId)
    .select(...commentProperties)
}
export async function getCommentsByParentId(parentId: number) {
  return db('comments')
    .where('parent', parentId)
    .select(...commentProperties)
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
