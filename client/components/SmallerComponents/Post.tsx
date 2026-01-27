import DOMPurify from 'dompurify'
import { Post as PostModel } from '../../../models/post'
import { useComments } from '../../hooks/useComments'
import { useUser, useUserById } from '../../hooks/useUsers'
import { CommentSection } from './CommentSection'
import { LoadingSpinner } from './LoadingSpinner'
import { useAuth0 } from '@auth0/auth0-react'
import { useDeletePost } from '../../hooks/usePosts'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { CrossSymbol } from './SymbolSvgs'
import { TimeDisplay } from './ReusableFunctions'
import AdminDeleteForm from './AdminDeleteForm'

interface postProps {
  post: PostModel
}

function Post({ post }: postProps) {
  const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const deletePostMutation = useDeletePost()
  const { data: postAuthor, isLoading: postAuthorIsLoading } = useUserById(
    post.userId,
  )
  const { data: currentUser } = useUser()

  const { comments, isLoading: commentsAreLoading } = useComments({
    postId: post.id,
  })

  if (postAuthorIsLoading) {
    return <LoadingSpinner />
  }

  const handleDelete = async () => {
    const token = await getAccessTokenSilently()
    deletePostMutation.mutate({ postId: post.id, token })
  }

  const sanitizedContent = DOMPurify.sanitize(post.content, {
    ALLOWED_TAGS: [
      'p',
      'pre',
      'strong',
      'em',
      'u',
      'ol',
      'ul',
      'li',
      'a',
      'code',
      'br',
    ],
    ALLOWED_ATTR: ['href'],
  })

  return (
    <div className="m-2">
      <div className="relative rounded-sm border-[1.5px] border-[#d0cbba] bg-[#faf8f1] p-1">
        <div className="mini-header flex h-fit w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-1">
            <img
              src={postAuthor?.profilePicture || '/assets/default.jpeg'}
              alt={`${postAuthor?.username}'s profile`}
              className="max-h-10 min-h-10 max-w-10 min-w-10 rounded-full object-cover"
            />
            <div className="flex flex-row items-baseline gap-1">
              <p>{postAuthor?.username}</p>
              <p className="text-xs text-gray-500">
                <TimeDisplay timestamp={String(post.dateAdded)} />
              </p>
            </div>
          </div>
          {isAuthenticated &&
            (post.userId == user?.sub || currentUser?.admin) && (
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button className="absolute top-1 right-1 flex items-center justify-center rounded-sm bg-[#eca4a4] p-0.5 active:bg-[#ea8686]">
                    <CrossSymbol className="h-5 cursor-pointer" />
                  </button>
                </AlertDialog.Trigger>
                <AlertDialog.Portal>
                  <AlertDialog.Overlay className="AlertDialogOverlay" />
                  <AlertDialog.Content className="AlertDialogContent">
                    <AlertDialog.Title className="AlertDialogTitle">
                      Delete post?
                    </AlertDialog.Title>

                    {currentUser!.admin ? (
                      <div>
                        <AlertDialog.Description className="AlertDialogDescription">
                          <AdminDeleteForm
                            userId={post.userId}
                            contentDeleted={
                              post.title != '' ? post.title : post.content
                            }
                            onComplete={() => handleDelete()}
                          />
                        </AlertDialog.Description>
                        <AlertDialog.Cancel asChild>
                          <button className="cursor-pointer rounded-md border px-1 shadow-md hover:bg-[#e2dece]">
                            Cancel
                          </button>
                        </AlertDialog.Cancel>
                      </div>
                    ) : (
                      <div>
                        <AlertDialog.Description className="AlertDialogDescription">
                          <p>This cannot be undone.</p>
                        </AlertDialog.Description>
                        <div
                          style={{
                            display: 'flex',
                            gap: 25,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <AlertDialog.Cancel asChild>
                            <button className="cursor-pointer rounded-md border px-1 shadow-md hover:bg-[#e2dece]">
                              Cancel
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              className="cursor-pointer rounded-md border bg-[#f8a1a1] p-2 px-1 shadow-md hover:bg-[#fd7474]"
                              onClick={() => handleDelete()}
                            >
                              Delete
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </div>
                    )}
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            )}
        </div>
        <div className="p-1">
          {post.title && (
            <p
              className={`${post.titleSize ? `${post.titleSize}` : 'text-2xl'}`}
            >
              {post.title}
            </p>
          )}
          <div
            className={`${post.contentSize ? `${post.contentSize}` : 'text-md'} overflow-scroll`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
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
