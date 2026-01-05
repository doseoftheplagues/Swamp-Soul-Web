import { useAuth0 } from '@auth0/auth0-react'
import { Comment } from '../../../models/comment'
import { useUserById } from '../../hooks/useUsers'
import { useComments } from '../../hooks/useComments'
import { CrossSymbol, TextBubbles } from './SymbolSvgs'
import { useState } from 'react'
import { TimeDisplay } from './ReusableFunctions'

type CommentWithReplies = Comment & { replies: CommentWithReplies[] }

interface ReplyCommentProps {
  comment: CommentWithReplies
  originIdType: string
  originId: number
}

export function ReplyComment({
  comment,
  originIdType,
  originId,
}: ReplyCommentProps) {
  const [formData, setFormData] = useState({
    content: '',
    userId: '',
    parent: undefined,
  })
  const [isReplying, setIsReplying] = useState(false)
  const { deleteComment, addComment } = useComments()
  const {
    data: commentAuthor,
    isLoading: commentAuthorIsLoading,
    isError: commentAuthorIsError,
  } = useUserById(comment.userId)
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleReplySubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    parentId: number,
  ) => {
    e.preventDefault()
    const token = await getAccessTokenSilently()

    if (user != null && user != undefined) {
      const userId = user.sub
      const submissionData = {
        ...formData,
        userId: userId!,
        parent: parentId,
        [originIdType]: originId,
      }
      addComment.mutate({ comment: submissionData, token })
    }
    setFormData({
      content: '',
      userId: '',
      parent: undefined,
    })
    setIsReplying(false)
  }

  return (
    <div className="relative ml-3">
      <div className="ml-3 h-2 border-0"></div>
      <div className="flex flex-row rounded-md border-2 border-[#dad7c2e0] bg-[#fbfaf6] px-1 py-1">
        <div className="mr-1">
          <img
            src={commentAuthor?.profilePicture || '/assets/default.jpeg'}
            alt={`${commentAuthor?.username}'s profile`}
            className="max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-fill"
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-baseline">
              <p className="">
                {commentAuthor?.username}{' '}
                <span className="ml-1 text-xs text-gray-500">
                  <TimeDisplay timestamp={String(comment.dateAdded)} />
                </span>
              </p>
            </div>
            <div className="flex flex-row items-center">
              {isAuthenticated && commentAuthor?.authId == user?.sub && (
                <button
                  onClick={() => handleDeleteClick(comment.id)}
                  className="flex items-center justify-center rounded-full p-0.5"
                >
                  <CrossSymbol className="h-5 cursor-pointer" />
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="flex items-center justify-center rounded-full p-0.5"
                >
                  <TextBubbles
                    className={'relative top-0.5 h-6 cursor-pointer'}
                  />
                </button>
              )}
            </div>
          </div>
          <p className="text-md pr-2 text-pretty">{comment.content}</p>
        </div>
      </div>
      {isReplying && (
        <div className="ReplyForm">
          <div className="ml-3">
            <div className="ml-3 h-2 border-l-2 border-[#c1bd9c]"></div>
            <div className="flex flex-col rounded-md border-2 border-[#dad7c2e0] bg-[#fbfaf6] px-1 py-1 pl-2">
              <p>Reply to {commentAuthor?.username}</p>
              <form
                className="flex h-fit w-full flex-row items-baseline"
                onSubmit={(e) => handleReplySubmit(e, comment.id)}
              >
                <label htmlFor="addComment" className="sr-only">
                  Reply to {commentAuthor?.username}
                </label>

                <div className="w-full">
                  <input
                    type="text"
                    id="addComment"
                    name="content"
                    placeholder={'@' + commentAuthor?.username + '...'}
                    className="commentInput text-md w-full"
                    onChange={handleChange}
                    value={formData.content}
                  ></input>
                  <div className="border-b-2 border-b-[#dad7c2d0]"></div>
                </div>
                <button
                  type="submit"
                  className="text-md mr-2 rounded-tl-sm rounded-r-sm rounded-bl-none bg-[#dad7c2] px-1.5 py-0.5"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {comment.replies?.map((reply: CommentWithReplies) => (
        <ReplyComment
          key={reply.id}
          comment={reply}
          originIdType={originIdType}
          originId={originId}
        />
      ))}
    </div>
  )
}
