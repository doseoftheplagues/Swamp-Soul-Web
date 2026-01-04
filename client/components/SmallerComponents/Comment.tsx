import { useAuth0 } from '@auth0/auth0-react'
import { Comment as CommentModel } from '../../../models/comment'
import { useComments } from '../../hooks/useComments'
import { useUserById } from '../../hooks/useUsers'
import { ReplyComment } from './ReplyComment'

type CommentWithReplies = CommentModel & { replies: CommentWithReplies[] }

interface CommentProps {
  comment: CommentWithReplies
}

export function Comment({ comment }: CommentProps) {
  const { deleteComment } = useComments()
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
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

  async function handleDeleteClick(commentId: number) {
    try {
      const token = await getAccessTokenSilently()
      deleteComment.mutate({ commentId: commentId, token: token })
    } catch (error) {
      console.log('an error occured')
    }
  }

  return (
    <div className="m-2 flex flex-col">
      <div className="flex flex-row rounded-md border-2 border-[#dad7c2d0] bg-[#fbfaf6] p-1">
        <div className="mr-1 flex">
          <img
            src={commentAuthor?.profilePicture || '/assets/default.jpeg'}
            alt={`${commentAuthor?.username}'s profile`}
            className="max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-contain"
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex flex-row justify-between">
            <div>
              <p className="">{commentAuthor?.username}</p>
            </div>
            {isAuthenticated && commentAuthor?.authId == user?.sub && (
              <button
                onClick={() => handleDeleteClick(comment.id)}
                className="ml-2 bg-amber-100"
              >
                Del
              </button>
            )}
          </div>
          <p className="text-md text-pretty">{comment.content}</p>
        </div>
      </div>
      {comment.replies?.map((reply: CommentWithReplies) => (
        <ReplyComment key={reply.id} comment={reply} />
      ))}
    </div>
  )
}
