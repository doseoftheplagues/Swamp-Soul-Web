import { Comment } from '../../../models/comment'
import { useUserById } from '../../hooks/useUsers'

type CommentWithReplies = Comment & { replies: CommentWithReplies[] }

interface ReplyCommentProps {
  comment: CommentWithReplies
}

export function ReplyComment({ comment }: ReplyCommentProps) {
  const {
    data: commentAuthor,
    isLoading: commentAuthorIsLoading,
    isError: commentAuthorIsError,
  } = useUserById(comment.userId)

  if (commentAuthorIsLoading) {
    return <div className="h-12 w-60 animate-pulse bg-gray-300"></div>
  }
  if (commentAuthorIsError) {
    return <p>Error</p>
  }

  return (
    <div className="ml-3">
      <div className="ml-3 h-2 border-l-2 border-[#c1bd9c]"></div>
      <div className="flex flex-row rounded-md border-2 border-[#dad7c2e0] bg-[#fbfaf6] py-1 pr-3 pl-1">
        <div className="mr-1">
          <img
            src={commentAuthor?.profilePicture || '/assets/default.jpeg'}
            alt={`${commentAuthor?.username}'s profile`}
            className="max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <p>{commentAuthor?.username}</p>
          <p className="text-md text-pretty">{comment.content}</p>
        </div>
      </div>
      {comment.replies?.map((reply: CommentWithReplies) => (
        <ReplyComment key={reply.id} comment={reply} />
      ))}
    </div>
  )
}
