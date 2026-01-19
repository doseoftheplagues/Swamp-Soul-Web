export interface PosterData {
  image: string
  designer: string
  upcomingShowId: number
  archiveShowId: number
}

export interface UpcomingPosterData {
  image: string
  designer: string
  upcomingShowId: number
}

export interface Poster extends PosterData {
  id: number
}
