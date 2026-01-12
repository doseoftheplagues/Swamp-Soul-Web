export interface CommentData {
  upcomingShowId?: number
  archiveShowId?: number
  postId?: number
  postAuthorId?: string
  parent?: number
  userId: string
  content: string
  dateAdded: Date
}

export interface Comment extends CommentData {
  id: number
}
