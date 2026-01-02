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

export async function getCommentsByUpcomingShowId(id: number) {
  return db('comments')
    .where('upcoming_show_id', id)
    .select(...commentProperties)
}
