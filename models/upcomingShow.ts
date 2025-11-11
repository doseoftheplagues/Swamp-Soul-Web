export interface UpcomingShowData {
  date: string
  doors_time: string
  performers: string
  location_name: string
  wheelchair_accessible: boolean
  mobility_accessible: boolean
  bathrooms_nearby: boolean
  noise_level: string
  //optional parameterss
  location_coords?: string | null
  set_times?: string | null
  tickets_link?: string | null
  poster_id?: number | null
  description?: string | null
  max_capacity?: number | null
  canceled?: boolean | null
}

export interface UpcomingShow extends UpcomingShowData {
  id: number
}
