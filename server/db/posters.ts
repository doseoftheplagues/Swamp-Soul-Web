import connection from './connection.ts'
import { PosterData } from '../../models/poster.ts'

const db = connection

export async function getPostersByUpcomingShowId(showId: number) {
  const result = await db('posters')
    .where('upcoming_show_id', showId)
    .select(
      'upcoming_show_id as upcomingShowId',
      'archive_show_id as archiveShowid',
      'id',
      'designer',
      'image',
    )
  return result
}

export async function getPostersByArchiveShowId(showId: number) {
  const result = await db('posters')
    .where('archive_show_id', showId)
    .select(
      'upcoming_show_id as upcomingShowId',
      'archive_show_id as archiveShowid',
      'id',
      'designer',
      'image',
    )
  return result
}

export async function addPoster(posterData: PosterData) {
  const { upcomingShowId, archiveShowId, designer, image } = posterData
  const [result] = await db('posters').insert({
    upcoming_show_id: upcomingShowId,
    archive_show_id: archiveShowId,
    designer,
    image,
  })
  return result
}

export async function deletePoster(posterId: number) {
  const result = await db('posters').where('id', posterId).del()
  return result
}
