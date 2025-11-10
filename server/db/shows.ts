import knexfile from './knexfile.js'
import knex from 'knex'

const db = knex(knexfile.development)

export function getAllShows() {
  return db('shows')
    .join('shows_posters', 'shows.id', '=', 'shows_posters.show_id')
    .join('posters', 'posters.id', '=', 'shows_posters.poster_id')
    .select(
      'posters.id as posterId',
      'performers',
      'date',
      'location',
      'image',
      'designer',
      'shows.id as showId',
    )
}

export function searchShows(searchterm: string) {
  return db('shows')
    .select('shows.*')
    .distinct()
    .join('shows_posters', 'shows.id', '=', 'shows_posters.show_id')
    .join('posters', 'posters.id', '=', 'shows_posters.poster_id')
    .where('date', 'like', `%${searchterm}%`)
    .orWhere('location', 'like', `%${searchterm}%`)
    .orWhere('performers', 'like', `%${searchterm}%`)
    .orWhere('posters.designer', 'like', `%${searchterm}%`)
}

export async function addPosterToShow(
  showId: number,
  posterData: { image: string; designer: string },
) {
  return db.transaction(async (trx) => {
    const [newPosterId] = await trx('posters')
      .insert(posterData)
      .returning('id')
    await trx('shows_posters').insert({
      show_id: showId,
      poster_id: newPosterId,
    })
  })
}

export async function addShowWithPoster(
  showData: { date: string; location: string; performers: string },
  posterData: { image: string; designer: string },
) {
  return db.transaction(async (trx) => {
    const newShow = await trx('shows').insert(showData).returning('id')
    const showId = newShow[0]
    const newPoster = await trx('posters').insert(posterData).returning('id')
    const posterId = newPoster[0]
    await trx('shows_posters').insert({
      poster_id: posterId,
      show_id: showId,
    })
  })
}

export async function addShowWithMultiplePosters(
  showData: {
    date: string
    location: string
    performers: string
  },
  postersData: { image: string; designer: string }[],
) {
  return db.transaction(async (trx) => {
    const newShow = await trx('shows').insert(showData).returning('id')
    const showId = newShow[0].id

    for (let i = 0; i < postersData.length; i++) {
      const current = postersData[i]
      const newPoster = await trx('posters').insert(current).returning('id')
      const newPosterID = newPoster[0].id
      await trx('shows_posters').insert({
        poster_id: newPosterID,
        show_id: showId,
      })
    }
  })
}
