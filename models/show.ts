export interface Gig {
  date: string
  location?: string
  performers: string
  posters: Poster[]
}

export interface Poster {
  image: string
  designer: string
}
