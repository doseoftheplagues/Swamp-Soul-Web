export interface PostData {
  userId: string
  content: string
  title: string
  image: string
  dateAdded: Date
  titleFont: string
  titleSize: string
  contentFont: string
  contentSize: string
}

export interface Post extends PostData {
  id: number
}
