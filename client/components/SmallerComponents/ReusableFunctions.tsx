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
