import { useState } from 'react'
import { Comment as CommentModel } from '../../../models/comment'
import { useComments } from '../../hooks/useComments'
import { Comment } from './Comment'
import { useAuth0 } from '@auth0/auth0-react'
import buildCommentTree from './ReusableFunctions'
import { useUser } from '../../hooks/useUsers'

interface CommentSectionProps {
  comments: CommentModel[]
  originIdType: string
  originId: number
}

export function CommentSection({
  comments,
  originIdType,
  originId,
}: CommentSectionProps) {
  const { addComment } = useComments()
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const [sendCommmentHidden, setSendCommentHidden] = useState(true)
  const [formData, setFormData] = useState({
    content: '',
    userId: '',
    parent: undefined,
  })
  const { data: databaseUser } = useUser()
  const commentTree = buildCommentTree(comments)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = await getAccessTokenSilently()

    if (user != null && user != undefined) {
      const userId = user.sub
      const submissionData = {
        ...formData,
        userId: userId!,
        [originIdType]: originId,
      }
      addComment.mutate({ comment: submissionData, token })
    }
    setFormData({
      content: '',
      userId: '',
      parent: undefined,
    })
  }

  return (
    <div className="CommentsSection mt-2 h-fit min-h-24 w-fit max-w-1/2 rounded-md border-2 border-[#dad7c2d0]">
      {isAuthenticated && (
        <div className="flex flex-row items-center justify-between p-1">
          <img
            src={databaseUser?.profilePicture || '/assets/default.jpeg'}
            alt={`${databaseUser?.username}'s profile`}
            className="mr-2 inline-block max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-contain"
          />
          <form className="flex h-fit w-full flex-row" onSubmit={handleSubmit}>
            <label htmlFor="addComment" className="sr-only">
              New comment
            </label>
            <div className="w-full border-b-2 border-b-[#dad7c2d0]">
              <input
                type="text"
                id="addComment"
                name="content"
                placeholder="Say something..."
                className="commentInput text-md w-full py-0"
                onFocus={() => setSendCommentHidden(false)}
                onChange={handleChange}
                value={formData.content}
              ></input>
            </div>
            {sendCommmentHidden == false && (
              <button
                type="submit"
                className="text-md mr-2 rounded-tl-sm rounded-r-sm rounded-bl-none bg-[#dad7c2] px-1 py-0.5"
              >
                Send
              </button>
            )}
          </form>
        </div>
      )}
      <div className="p-1">
        {commentTree.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
