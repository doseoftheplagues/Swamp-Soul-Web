import { Comment as CommentModel } from '../../../models/comment'
import { useUserById } from '../../hooks/useUsers'
import { ReplyComment } from './ReplyComment'

type CommentWithReplies = CommentModel & { replies: CommentWithReplies[] }

interface CommentProps {
  comment: CommentWithReplies
}

export function Comment({ comment }: CommentProps) {
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
    <div className="m-2 flex flex-col">
      <div className="flex flex-row rounded-md border-2 border-[#dad7c2d0] bg-[#fbfaf6] p-1">
        <div className="flex">
          <img
            src={commentAuthor?.profilePicture || '/assets/default.jpeg'}
            alt={`${commentAuthor?.username}'s profile`}
            className="mr-2 inline-block h-10 w-10 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <p className="italic">{commentAuthor?.username}</p>

          <p className="text-md">{comment.content}</p>
        </div>
      </div>
      {comment.replies?.map((reply: CommentWithReplies) => (
        <ReplyComment key={reply.id} comment={reply} />
      ))}
    </div>
  )
}
