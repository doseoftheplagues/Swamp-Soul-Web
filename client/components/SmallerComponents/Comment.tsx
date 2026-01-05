import { useAuth0 } from '@auth0/auth0-react'
import { Comment as CommentModel } from '../../../models/comment'
import { useComments } from '../../hooks/useComments'
import { useUserById } from '../../hooks/useUsers'
import { ReplyComment } from './ReplyComment'
import { CrossSymbol, TextBubbles } from './SymbolSvgs'
import { useState } from 'react'

type CommentWithReplies = CommentModel & { replies: CommentWithReplies[] }

interface CommentProps {
  comment: CommentWithReplies
  originIdType: string
  originId: number
}

export function Comment({ comment, originIdType, originId }: CommentProps) {
  const [formData, setFormData] = useState({
    content: '',
    userId: '',
    parent: undefined,
  })
  const [isReplying, setIsReplying] = useState(false)
  const { deleteComment, addComment } = useComments()
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
          <p className="text-md text-pretty">{comment.content}</p>
        </div>
      </div>
      {isReplying && (
        <div className="ReplyForm">
          <div className="ml-3">
            <div className="ml-3 h-2 border-l-2 border-[#c1bd9c]"></div>
            <div className="flex flex-row rounded-md border-2 border-[#dad7c2e0] bg-[#fbfaf6] px-1 py-1">
              <form
                className="flex h-fit w-full flex-row"
                onSubmit={(e) => handleReplySubmit(e, comment.id)}
              >
                <label htmlFor="addComment" className="sr-only">
                  New comment
                </label>
                <div className="mr-2 w-full border-b-2 border-b-[#dad7c2d0]">
                  <input
                    type="text"
                    id="addComment"
                    name="content"
                    placeholder="Say something..."
                    className="commentInput text-md -py-1 w-full"
                    onChange={handleChange}
                    value={formData.content}
                  ></input>
                </div>

                <button
                  type="submit"
                  className="text-md mr-2 rounded-tl-sm rounded-r-sm rounded-bl-none bg-[#dad7c2] px-1.5 py-1"
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
