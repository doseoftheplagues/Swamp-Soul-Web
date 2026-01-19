import { Comment as BaseComment } from '../../../models/comment'

type CommentWithReplies = BaseComment & { replies: CommentWithReplies[] }

export default function buildCommentTree(
  flatComments: BaseComment[],
): CommentWithReplies[] {
  const commentMap: { [id: number]: CommentWithReplies } = {}

  flatComments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] }
  })

  const rootComments: CommentWithReplies[] = []

  Object.values(commentMap).forEach((node) => {
    if (node.parent) {
      const parent = commentMap[node.parent]
      if (parent) {
        parent.replies.push(node)
      }
    } else {
      rootComments.push(node)
    }
  })

  return rootComments
}

import { formatDistanceToNowStrict, format, isBefore, subDays } from 'date-fns'

interface TimeDisplayProps {
  timestamp: string
}

export function TimeDisplay({ timestamp }: TimeDisplayProps) {
  const dateString = String(timestamp)
  const utcTimestamp = dateString.endsWith('Z')
    ? dateString
    : `${dateString.replace(' ', 'T')}Z`
  const date = new Date(utcTimestamp)
  const now = new Date()
  const oneWeekAgo = subDays(now, 7)

  let formattedTime: string

  if (isBefore(date, oneWeekAgo)) {
    formattedTime = format(date, 'MMM d, yyyy')
  } else {
    formattedTime = formatDistanceToNowStrict(date, { addSuffix: true })
  }

  return <span title={date.toLocaleString()}>{formattedTime}</span>
}
