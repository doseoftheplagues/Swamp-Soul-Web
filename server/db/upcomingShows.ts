import connection from './connection.ts'
import { UpcomingShowData, UpcomingShow } from '../../models/upcomingShow.ts'

const db = connection

const showProperites = [
  'id',
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
]

//read
export async function getUpcomingShows(): Promise<UpcomingShow[]> {
  const result = await db('upcoming_shows').select(
    'id',
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
  return result
}

export async function getUpcomingShowById(id: number) {
  const result = await db('upcoming_shows')
    .where('id', id)
    .select([...showProperites])
  return result[0] as UpcomingShow
}

//create
export async function addUpcomingShow(showData: UpcomingShowData) {
  const {
    date,
    doorsTime,
    performers,
    locationName,
    wheelchairAccessible,
    mobilityAccessible,
    bathroomsNearby,
    noiseLevel,
    locationCoords,
    setTimes,
    ticketsLink,
    posterId,
    description,
    maxCapacity,
    canceled,
  } = showData

  const [result] = await db('upcoming_shows')
    .insert({
      date,
      doors_time: doorsTime,
      performers,
      location_name: locationName,
      wheelchair_accessible: wheelchairAccessible,
      mobility_accessible: mobilityAccessible,
      bathrooms_nearby: bathroomsNearby,
      noise_level: noiseLevel,
      location_coords: locationCoords,
      set_times: setTimes,
      tickets_link: ticketsLink,
      poster_id: posterId,
      description,
      max_capacity: maxCapacity,
      canceled,
    })
    .returning([
      'id',
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

  return result
}

//update

export async function updateUpcomingShow(
  id: number,
  showData: UpcomingShowData,
) {
  const {
    date,
    doorsTime,
    performers,
    locationName,
    wheelchairAccessible,
    mobilityAccessible,
    bathroomsNearby,
    noiseLevel,
    locationCoords,
    setTimes,
    ticketsLink,
    posterId,
    description,
    maxCapacity,
    canceled,
  } = showData
  const snakeCaseShowData = {
    date,
    doors_time: doorsTime,
    performers,
    location_name: locationName,
    wheelchair_accessible: wheelchairAccessible,
    mobility_accessible: mobilityAccessible,
    bathrooms_nearby: bathroomsNearby,
    noise_level: noiseLevel,
    location_coords: locationCoords,
    set_times: setTimes,
    tickets_link: ticketsLink,
    poster_id: posterId,
    description,
    max_capacity: maxCapacity,
    canceled,
  }

  return await db('upcoming_shows').where('id', id).update(snakeCaseShowData)
}

//delete

export async function deleteUpcomingShow(id: number) {
  return await db('upcoming_shows').where('id', id).delete()
}
