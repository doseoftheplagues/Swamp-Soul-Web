import knexfile from './knexfile.js'
import knex from 'knex'

const db = knex(knexfile.development)

export function getAllShows() {
  return db('shows').select()
}

export function searchShows(searchterm: string) {
  return db('shows')
    .join('posters', 'shows.posterId', '=', 'posters.id')
    .where('date', 'like', `%${searchterm}%`)
    .orWhere('location', 'like', `%${searchterm}%`)
    .orWhere('performers', 'like', `%${searchterm}%`)
    .orWhere('posters.designer', 'like', `%${searchterm}%`)
}
