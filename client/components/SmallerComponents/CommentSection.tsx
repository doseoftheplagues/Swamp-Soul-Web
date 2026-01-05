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
    <div
      className="CommentsSection mt-2 h-fit rounded-md border-2 border-[#dad7c2d0] sm:max-w-3/5 sm:min-w-2/5"
      id="comment-section"
    >
      {!isAuthenticated && (
        <div className="mt-2 ml-2 w-fit border-b-2 border-b-[#dad7c2d0]">
          <p className="pr-2 text-[#3a3a3a]"> Log in to add comments</p>
        </div>
      )}
      {isAuthenticated && (
        <div className="mt-1 flex flex-row items-center justify-between p-1">
          <img
            src={databaseUser?.profilePicture || '/assets/default.jpeg'}
            alt={`${databaseUser?.username}'s profile`}
            className="mx-1.5 inline-block max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-fill"
          />
          <form
            className="flex h-fit w-full flex-row items-baseline"
            onSubmit={handleSubmit}
          >
            <label htmlFor="addComment" className="sr-only">
              New comment
            </label>
            <div className="w-full">
              <input
                type="text"
                id="addComment"
                name="content"
                placeholder="Say something..."
                className="commentInput text-md -py-1 w-full"
                onFocus={() => setSendCommentHidden(false)}
                onChange={handleChange}
                value={formData.content}
              ></input>
              <div
                className={`border-b-2 border-b-[#dad7c2d0] ${sendCommmentHidden == true && 'mr-2.5'}`}
              ></div>
            </div>
            {sendCommmentHidden == false && (
              <button
                type="submit"
                className="text-md mr-2 rounded-tl-sm rounded-r-sm rounded-bl-none bg-[#dad7c2] px-1.5 py-0.5"
              >
                Send
              </button>
            )}
          </form>
        </div>
      )}
      <div className="p-1">
        {commentTree.map((comment) => (
          <div className="m-2" key={comment.id}>
            <Comment
              comment={comment}
              originIdType={originIdType}
              originId={originId}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
