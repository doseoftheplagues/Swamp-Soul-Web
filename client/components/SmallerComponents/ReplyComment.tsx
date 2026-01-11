import { useAuth0 } from '@auth0/auth0-react'
import { Comment } from '../../../models/comment'
import { useUserById } from '../../hooks/useUsers'
import { useComments } from '../../hooks/useComments'
import { CrossSymbol, TextBubbles } from './SymbolSvgs'
import { useState } from 'react'
import { TimeDisplay } from './ReusableFunctions'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

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
    <div className="ReplyComment relative ml-3" id={`comment${comment.id}`}>
      <div className="ml-3 h-2 border-0"></div>
      <div className="flex flex-row rounded-md border-2 border-[#dad7c2e0] bg-[#fbfaf6] px-1 py-1">
        <div className="mr-1">
          <img
            src={commentAuthor?.profilePicture || '/assets/default.jpeg'}
            alt={`${commentAuthor?.username}'s profile`}
            className="max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-cover"
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="relative flex flex-row items-center justify-between">
            <div className="flex flex-col items-baseline sm:flex-row">
              <p className="text-sm sm:text-base">{commentAuthor?.username} </p>
              <p className="ml-1 text-xs text-gray-500">
                <TimeDisplay timestamp={String(comment.dateAdded)} />
              </p>
            </div>
            <div className="relative -top-0.5 -right-0.5">
              <div className="flex flex-row">
                {isAuthenticated && commentAuthor?.authId == user?.sub && (
                  <div>
                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <button className="flex items-center justify-center rounded-full">
                          <CrossSymbol className="h-5 cursor-pointer" />
                        </button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="AlertDialogOverlay" />
                        <AlertDialog.Content className="AlertDialogContent">
                          <AlertDialog.Title className="AlertDialogTitle">
                            Delete comment?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="AlertDialogDescription">
                            This cannot be undone.
                          </AlertDialog.Description>
                          <div
                            style={{
                              display: 'flex',
                              gap: 25,
                              justifyContent: 'flex-end',
                            }}
                          >
                            <AlertDialog.Cancel asChild>
                              <button className="rounded-md border border-[#c6c6c6] px-1 shadow-md hover:bg-[#faf8f1]">
                                Cancel
                              </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <button
                                className="rounded-md border border-[#e6e6e6] bg-[#fa3131] p-2 px-1 text-[#faf8f1] shadow-md hover:bg-[#fd7474]"
                                onClick={() => handleDeleteClick(comment.id)}
                              >
                                Delete
                              </button>
                            </AlertDialog.Action>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </div>
                )}
                {isAuthenticated && (
                  <button
                    onClick={() => setIsReplying(!isReplying)}
                    className="ml-0.5 flex items-center justify-center rounded-full"
                  >
                    <TextBubbles className="relative top-0.5 h-6 cursor-pointer" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="pr-2 text-sm text-pretty sm:text-base">
            {comment.content}
          </p>
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
