import { useState } from 'react'
import { Comment as CommentModel } from '../../../models/comment'
import { useComments } from '../../hooks/useComments'
import { Comment } from './Comment'
import { useAuth0 } from '@auth0/auth0-react'
import { buildCommentTree } from './ReusableFunctions'

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
  const [formData, setFormData] = useState({
    content: '',
    userId: '',
  })

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
  }

  return (
    <div className="CommentsSection mt-2 h-96 w-fit rounded-md border-2 border-[#dad7c2d0]">
      {isAuthenticated && (
        <div className="p-1">
          <form className="flex flex-row" onSubmit={handleSubmit}>
            <label htmlFor="addComment" className="sr-only">
              New comment
            </label>
            <input
              type="text"
              id="addComment"
              name="addComment"
              placeholder="Say something..."
              className="w-full px-1 py-0.5 text-sm"
              onChange={handleChange}
            ></input>
            <button
              type="submit"
              className="rounded-r-md border-y-2 border-r-2 bg-amber-100 p-1 text-sm"
            >
              Send
            </button>
          </form>
        </div>
      )}
      <div className="bg-[#ecead8d1] p-1">
        {commentTree.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  )
}
