export interface AdminMessage {
  id: number
  adminId: string
  userId: string
  contentDeleted: string
  reasonDeleted: string
}

export interface NewAdminMessage {
  adminId: string
  userId: string
  contentDeleted: string
  reasonDeleted: string
}