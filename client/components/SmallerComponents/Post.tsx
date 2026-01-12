import { Post as PostModel } from '../../../models/post'
import { useComments } from '../../hooks/useComments'
import { useUserById } from '../../hooks/useUsers'
import { CommentSection } from './CommentSection'
import { LoadingSpinner } from './LoadingSpinner'

interface postProps {
  post: PostModel
}

function Post({ post }: postProps) {
  const { data: postAuthor, isLoading: postAuthorIsLoading } = useUserById(
    post.userId,
  )

  const { comments, isLoading: commentsAreLoading } = useComments({
    postId: post.id,
  })

  if (postAuthorIsLoading) {
    return <LoadingSpinner />
  }
  return (
    <div className="m-2">
      <div className="rounded-sm border-[1.5px] border-[#d0cbba] bg-[#faf8f1] p-2">
        {post.title && (
          <p className={`${post.titleSize ? `${post.titleSize}` : 'text-2xl'}`}>
            {post.title}
          </p>
        )}
        <p
          className={`${post.contentSize ? `${post.contentSize}` : 'text-md'}`}
        >
          {post.content}
        </p>
      </div>
      <div className="flex justify-center">
        <div className="relative h-fit w-[98%] rounded-b-md bg-[#faf8f1]">
          {commentsAreLoading ? (
            <LoadingSpinner />
          ) : (
            <CommentSection
              comments={comments}
              originIdType={'postId'}
              originId={post.id}
              classes="w-full rounded-b-md border-b-2 border-b-[#dad7c2d0] border-x-2 border-x-[#dad7c2d0] "
            />
          )}
        </div>
      </div>
    </div>
  )
}
export default Post
