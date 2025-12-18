import connection from './connection.ts'

const db = connection

export function getAllShows() {
  return db('shows')
    .join('posters', 'shows.id', '=', 'posters.show_id')
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


export async function addShowWithPoster(
  showData: { date: string; location: string; performers: string },
  posterData: { image: string; designer: string },
) {
  return db.transaction(async (trx) => {
    const newShow = await trx('shows').insert(showData).returning('id')
    const showId = newShow[0].id
    const newPoster = await trx('posters').insert(posterData).returning('id')
    const posterId = newPoster[0].id
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

export async function deleteArchiveShow(showId: number) {}
