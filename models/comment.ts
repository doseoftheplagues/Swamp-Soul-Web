export interface CommentData {
  upcomingShowId?: number
  archiveShowId?: number
  postId?: number
  parent?: number
  userId: string
  content: string
}

export interface Comment extends CommentData {
  id: number
}
