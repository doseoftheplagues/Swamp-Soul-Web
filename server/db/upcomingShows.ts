import connection from './connection.ts'
import { UpcomingShowData, UpcomingShow } from '../../models/upcomingShow.ts'

const db = connection
//read
export function getUpcomingShows() {
  return db('upcoming_shows').select(
    'date',
    'doors_time as doorsTime',
    'performers',
    'location_name as locationName',
    'wheelchair_accessible as wheelchairAccessible',
    'mobility_accessible as mobilityAccessible',
    'bathrooms_nearby as bathroomsNearby',
    'noise_level as noiseLevel',
    'location_coords as locationCoords',
    'set_times as setTimes',
    'tickets_link as ticketsLink',
    'poster_id as posterId',
    'description',
    'max_capacity as maxCapacity',
    'canceled',
  )
}
//create
export async function addUpcomingShow({
  date,
  doors_time,
  performers,
  location_name,
  wheelchair_accessible,
  mobility_accessible,
  bathrooms_nearby,
  noise_level,
  location_coords,
  set_times,
  tickets_link,
  poster_id,
  description,
  max_capacity,
  canceled,
}: UpcomingShowData) {
  const result = await db('upcoming_shows')
    .insert({
      date,
      doors_time,
      performers,
      location_name,
      wheelchair_accessible,
      mobility_accessible,
      bathrooms_nearby,
      noise_level,
      location_coords,
      set_times,
      tickets_link,
      poster_id,
      description,
      max_capacity,
      canceled,
    })
    .returning([
      'date',
      'doors_time as doorsTime',
      'performers',
      'location_name as locationName',
      'wheelchair_accessible as wheelchairAccessible',
      'mobility_accessible as mobilityAccessible',
      'bathrooms_nearby as bathroomsNearby',
      'noise_level as noiseLevel',
      'location_coords as locationCoords',
      'set_times as setTimes',
      'tickets_link as ticketsLink',
      'poster_id as posterId',
      'description',
      'max_capacity as maxCapacity',
      'canceled',
    ])
  const resultNoArray = result[0]

  return resultNoArray as UpcomingShow
}

//update

export async function updateUpcomingShow(id: number, showData: object) {
  return await db('upcoming_shows').where('id', id).update(showData)
}

//delete
