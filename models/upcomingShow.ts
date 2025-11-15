export interface UpcomingShowData {
  date: string
  doorsTime: string
  performers: string
  locationName: string
  wheelchairAccessible: boolean
  mobilityAccessible: boolean
  bathroomsNearby: boolean
  noiseLevel: string
  //optional parameterss
  locationCoords?: string | null
  setTimes?: string | null
  ticketsLink?: string | null
  posterId?: number | null
  description?: string | null
  maxCapacity?: number | null
  canceled?: boolean | null
}

export interface UpcomingShow extends UpcomingShowData {
  id: number
}
