import connection from './connection.ts'
import { UpcomingShowData, UpcomingShow } from '../../models/upcomingShow.ts'

const db = connection

const showProperties = [
  'id',
  'date',
  'doors_time as doorsTime',
  'price',
  'performers',
  'location_name as locationName',
  'wheelchair_accessible as wheelchairAccessible',
  'mobility_accessible as mobilityAccessible',
  'bathrooms_nearby as bathroomsNearby',
  'noise_level as noiseLevel',
  'user_id as userId',
  'location_coords as locationCoords',
  'set_times as setTimes',
  'tickets_link as ticketsLink',
  'description',
  'max_capacity as maxCapacity',
  'canceled',
  'name',
  'city',
]

//read
export async function getUpcomingShows(): Promise<UpcomingShow[]> {
  const result = await db('upcoming_shows').select(...showProperties)
  return result
}

export async function getUpcomingShowById(id: number) {
  const result = await db('upcoming_shows')
    .where('id', id)
    .select(...showProperties)
  return result[0] as UpcomingShow
}

export async function getUpcomingShowsByUserId(id: string) {
  const result = await db('upcoming_shows')
    .where('user_id', id)
    .select(...showProperties)
  return result
}

//create
export async function addUpcomingShow(showData: UpcomingShowData) {
  const {
    date,
    doorsTime,
    price,
    performers,
    locationName,
    wheelchairAccessible,
    mobilityAccessible,
    bathroomsNearby,
    noiseLevel,
    userId,
    locationCoords,
    setTimes,
    ticketsLink,

    description,
    maxCapacity,
    canceled,
    name,
  } = showData

  const [result] = await db('upcoming_shows')
    .insert({
      date,
      doors_time: doorsTime,
      price,
      performers,
      location_name: locationName,
      wheelchair_accessible: wheelchairAccessible,
      mobility_accessible: mobilityAccessible,
      bathrooms_nearby: bathroomsNearby,
      noise_level: noiseLevel,
      user_id: userId,
      location_coords: locationCoords,
      set_times: setTimes,
      tickets_link: ticketsLink,

      description,
      max_capacity: maxCapacity,
      canceled,
      name,
    })
    .returning([...showProperties])

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
    price,
    performers,
    locationName,
    wheelchairAccessible,
    mobilityAccessible,
    bathroomsNearby,
    noiseLevel,
    locationCoords,
    setTimes,
    ticketsLink,

    description,
    maxCapacity,
    canceled,
    name,
  } = showData
  const snakeCaseShowData = {
    date,
    doors_time: doorsTime,
    price,
    performers,
    location_name: locationName,
    wheelchair_accessible: wheelchairAccessible,
    mobility_accessible: mobilityAccessible,
    bathrooms_nearby: bathroomsNearby,
    noise_level: noiseLevel,
    location_coords: locationCoords,
    set_times: setTimes,
    tickets_link: ticketsLink,
    description,
    max_capacity: maxCapacity,
    canceled,
    name,
  }

  return await db('upcoming_shows').where('id', id).update(snakeCaseShowData)
}

//delete

export async function deleteUpcomingShow(id: number, authId?: string) {
  const query = db('upcoming_shows').where('id', id)

  if (authId) {
    query.where('user_id', authId)
  }

  return await query.delete()
}
