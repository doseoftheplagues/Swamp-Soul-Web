import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { ProfilePlaceholder } from './SmallerComponents/ProfilePlaceholder'
import { useState } from 'react'
import { FileUploader } from './SmallerComponents/FileUploader'
import EditProfile from './EditProfile'
import { useImage } from '../hooks/useImage'
import { useGetUpcomingShowsByUserId } from '../hooks/useUpcomingShows'
import { UpcomingShow } from '../../models/upcomingShow'
import UpcomingShowCard from './SmallerComponents/UpcomingShowCard'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { DropdownMenu } from 'radix-ui'
import { ToolsSymbol } from './SmallerComponents/SymbolSvgs'
import { useComments } from '../hooks/useComments'
import { Comment } from './SmallerComponents/Comment'
import { Link } from 'react-router'
import { usePosts, usePostsByUserId } from '../hooks/usePosts'
import Post from './SmallerComponents/Post'
import { Post as PostModel } from '../../models/post'
import { useLinks } from '../hooks/useLinks'
import * as Form from '@radix-ui/react-form'
import { Cross1Icon } from '@radix-ui/react-icons'
import { useAdminMessagesByUser } from '../hooks/useAdminMessages'
import AdminMessage from './SmallerComponents/AdminMessage'

const Profile = () => {
  const { deleteImage } = useImage()
  const [editPfpIsHidden, setEditPfpIsHidden] = useState(true)
  const [editDetailsIsHidden, setEditDetailsIsHidden] = useState(true)
  const [editLinksIsHidden, setEditLinksIsHidden] = useState(true)
  const [blogOrActivity, setBlogOrActivity] = useState('blog')
  const [visibleSection, setVisibleSection] = useState('')
  const [postFormData, setPostFormData] = useState({
    title: '',
    content: '',
    image: '',
    titleFont: '',
    titleSize: '',
    contentFont: '',
    contentSize: '',
  })
  const [newLink, setNewLink] = useState({ title: '', link: '' })

  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { data: posts, isLoading: postsAreLoading } = usePostsByUserId(
    user?.sub,
  )
  const { links, addLink, deleteLink } = useLinks(user?.sub)
  const { data, update } = useUser()
  const userLoaded = user?.sub

  const addPostMutation = usePosts()

  const {
    data: userShows,
    isLoading: showsAreLoading,
    isError: showsAreError,
  } = useGetUpcomingShowsByUserId(userLoaded)
  const { messages } = useAdminMessagesByUser(userLoaded)

  const {
    comments: userCommentsAndReplies,
    isLoading: commentsAreLoading,
    isError: commentsAreError,
  } = useComments({ userId: userLoaded })

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }
  if (showsAreError) {
    console.log('Something went wrong loading your shows')
  }
  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <p className="mx-auto my-auto text-lg">Log in to view your profile</p>
      </div>
    )
  }

  function handleEditPfpClick() {
    if (editPfpIsHidden == true) {
      setEditPfpIsHidden(false)
    } else {
      setEditPfpIsHidden(true)
    }
  }

  const handleImageUrlReceived = async (url: string) => {
    try {
      const token = await getAccessTokenSilently()
      console.log('deleting old pfp')
      if (data?.profilePicture !== undefined) {
        const mutationVariables = { url: data?.profilePicture, token: token }
        deleteImage.mutate(mutationVariables)
      }
      console.log('updating pfp to ' + url)
      if (user?.sub !== undefined) {
        const userId = user.sub
        const updatedUser = {
          profilePicture: url,
        }
        update.mutate({
          id: userId,
          updatedUser: updatedUser,
          token: token,
        })
        console.log('PFP Update sucessful ')
        setEditPfpIsHidden(true)
      } else {
        console.log('User id not found')
      }
    } catch (error) {
      console.error(error)
    }
  }

  function handleEditDetailsCLick() {
    if (editDetailsIsHidden == true) {
      console.log('setting edit details to false')
      setEditDetailsIsHidden(false)
    } else {
      console.log('setting edit details to true')
      setEditDetailsIsHidden(true)
    }
  }

  function handleEditLinksClick() {
    if (editLinksIsHidden == true) {
      setEditLinksIsHidden(false)
    } else {
      setEditLinksIsHidden(true)
    }
  }

  const handleAddLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newLink.link.trim() || !newLink.title.trim()) return
    try {
      const token = await getAccessTokenSilently()
      if (!user?.sub) {
        console.error('User not found')
        return
      }
      addLink.mutate(
        {
          link: { ...newLink, user_id: user.sub },
          token,
        },
        {
          onSuccess: () => {
            setNewLink({ title: '', link: '' })
          },
        },
      )
    } catch (error) {
      console.error('Failed to add link:', error)
    }
  }

  const handleDeleteLink = async (id: number) => {
    try {
      const token = await getAccessTokenSilently()
      deleteLink.mutate({ id, token })
    } catch (error) {
      console.error('Failed to delete link:', error)
    }
  }

  function handleVisibleSectionClick(section: string) {
    setVisibleSection(section)
  }

  const handlePostFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setPostFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handlePostFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const token = await getAccessTokenSilently()
    if (user?.sub) {
      addPostMutation.mutate(
        {
          postData: {
            ...postFormData,
            userId: user.sub,
            dateAdded: new Date(),
          },
          token,
        },
        {
          onSuccess: () => {
            setPostFormData({
              title: '',
              content: '',
              image: '',
              titleFont: '',
              titleSize: '',
              contentFont: '',
              contentSize: '',
            })
          },
        },
      )
    }
  }

  const myUserComments = userCommentsAndReplies
    ? userCommentsAndReplies.filter((c) => c.userId === userLoaded)
    : []
  const myUserCommentIds = new Set(myUserComments.map((c) => c.id))

  const rootCommentsByCurrentUser = myUserComments
    .filter((comment) => comment.parent === null)
    .sort(
      (a, b) =>
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
    )

  const repliesReceived = userCommentsAndReplies
    ? userCommentsAndReplies
        .filter(
          (comment) =>
            comment.userId !== userLoaded &&
            comment.parent &&
            myUserCommentIds.has(comment.parent),
        )
        .sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        )
    : []

  return isAuthenticated && user ? (
    <div className="mt-6 min-h-[calc(100vh-4rem)]">
      <div className="flex w-full flex-col items-start justify-center p-2 md:flex-row md:p-0">
        <div className="STUFFDIVCONTAINER relative flex w-full flex-col md:max-w-2/9">
          <div className="profileDiv mb-5 flex w-full flex-col rounded-md border-[1.5px] bg-[#e9e6d6ac] md:min-w-fit">
            <div>
              <div className="dropdown absolute right-0">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="IconButton"
                      aria-label="Customise options"
                    >
                      <ToolsSymbol className="h-11 hover:p-1" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="relative right-12 min-w-32 overflow-hidden rounded-md border-[1.5px] shadow-md">
                      <DropdownMenu.Item className="DropdownMenuItem">
                        {editDetailsIsHidden && (
                          <button
                            className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            disabled={
                              !editPfpIsHidden ||
                              !editDetailsIsHidden ||
                              !editLinksIsHidden
                            }
                            onClick={() => handleEditDetailsCLick()}
                          >
                            Edit Details
                          </button>
                        )}

                        {!editDetailsIsHidden && (
                          <button
                            className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            onClick={() => handleEditDetailsCLick()}
                          >
                            Cancel
                          </button>
                        )}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="DropdownMenuItem">
                        {editPfpIsHidden && (
                          <button
                            className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            onClick={() => handleEditPfpClick()}
                            disabled={
                              !editDetailsIsHidden || !editLinksIsHidden
                            }
                          >
                            Change profile picture
                          </button>
                        )}
                        {!editPfpIsHidden && (
                          <button
                            className="w-full bg-[#f7f9ef] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            onClick={() => handleEditPfpClick()}
                          >
                            Cancel
                          </button>
                        )}
                      </DropdownMenu.Item>
                      <DropdownMenu.Item className="DropdownMenuItem">
                        {editLinksIsHidden && (
                          <button
                            className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            onClick={() => handleEditLinksClick()}
                            disabled={!editDetailsIsHidden || !editPfpIsHidden}
                          >
                            Edit Links
                          </button>
                        )}
                        {!editLinksIsHidden && (
                          <button
                            className="w-full bg-[#e9ecdf] px-1 py-0.5 text-left text-sm hover:bg-[#d8d9b2b6] active:bg-[#d8d9b2] disabled:border-neutral-300 disabled:text-gray-300"
                            onClick={() => handleEditLinksClick()}
                          >
                            Cancel
                          </button>
                        )}
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
              {!editDetailsIsHidden && (
                <div>
                  <EditProfile
                    setEditDetailsIsHidden={setEditDetailsIsHidden}
                  />
                </div>
              )}
              {!editLinksIsHidden && (
                <div className="p-2">
                  <h3 className="text-md">Edit links</h3>
                  {links && links.length > 0 ? (
                    <ul className="">
                      {links.map((link) => (
                        <li key={link.id} className="flex items-center">
                          <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:underline"
                          >
                            {link.title}
                          </a>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="ml-2 cursor-pointer rounded-md border-[1.2px] bg-[#fc9f9f] p-0.5 text-sm"
                          >
                            <Cross1Icon />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">
                      You don&apos;t have any links yet.
                    </p>
                  )}

                  <Form.Root onSubmit={handleAddLink} className="mt-2">
                    <Form.Field name="newLinkTitle">
                      <Form.Control asChild>
                        <input
                          type="text"
                          className="mb-1 w-full rounded-sm p-1 text-sm"
                          placeholder="Title"
                          value={newLink.title}
                          onChange={(e) =>
                            setNewLink({ ...newLink, title: e.target.value })
                          }
                        />
                      </Form.Control>
                    </Form.Field>
                    <Form.Field name="newLink">
                      <Form.Control asChild>
                        <input
                          type="text"
                          className="w-full rounded-sm p-1 text-sm"
                          placeholder="Add a link"
                          value={newLink.link}
                          onChange={(e) =>
                            setNewLink({ ...newLink, link: e.target.value })
                          }
                        />
                      </Form.Control>
                    </Form.Field>
                    <Form.Submit asChild>
                      <button
                        className="mt-1 inline-flex justify-center rounded-md border-2 border-black bg-[#ead2d2be] px-2 py-1 text-sm font-medium text-black hover:bg-[#e1bebef5] focus:ring-offset-2 focus:outline-none active:bg-[#e1bebe] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={addLink.isPending}
                      >
                        {addLink.isPending ? 'Adding...' : 'Add Link'}
                      </button>
                    </Form.Submit>
                  </Form.Root>
                </div>
              )}
              {editDetailsIsHidden && editLinksIsHidden && (
                <div className="STUFFDIV">
                  {data?.admin == true && (
                    <p className="text-md rounded-t-md border-b-[1.5px] bg-[#e1bebe9f] pl-2 text-left text-[#424242]">
                      Site Admin
                    </p>
                  )}

                  <div className="usernamePfpBanner mt-2 flex flex-row">
                    {data?.profilePicture ? (
                      <div>
                        <img
                          src={data?.profilePicture}
                          alt={data?.username + ' profile picture'}
                          className="mx-1 h-16 w-16 min-w-15 overflow-hidden rounded-full border-2 border-[#acacac49] bg-gray-100 object-cover"
                        ></img>
                      </div>
                    ) : (
                      <ProfilePlaceholder />
                    )}
                    <div
                      className={`place-content-center pl-0.5 ${editPfpIsHidden && 'hidden'}`}
                    >
                      <FileUploader uploadSuccess={handleImageUrlReceived} />
                    </div>
                    <div
                      className={`place-content-center pl-0.5 ${!editPfpIsHidden && 'hidden'}`}
                    >
                      <div className="flex flex-row">
                        <p className="pr-4 text-xl font-bold wrap-anywhere">
                          {data?.username}
                          <span className="mx-1 text-base font-normal wrap-anywhere text-[#444] italic">
                            {data?.status}
                          </span>
                        </p>
                        <div className="relative top-0 right-0 -z-40 w-8"></div>
                      </div>
                      <p className="-mt-1 wrap-anywhere italic opacity-80">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="">
                      <p
                        className={`${!editPfpIsHidden && 'text-[#faf8f1]'} text-pretty`}
                      >
                        {data?.bio}
                      </p>
                      <div className="mx-auto my-2 w-[98%] border border-[#aaa89955]"></div>
                      {links.length !== 0 && (
                        <ul className="">
                          {links.map((link) => (
                            <li key={link.id} className="flex items-center">
                              <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm hover:underline"
                              >
                                {link.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {messages && messages.length != 0 && (
            <div className="profileDiv mb-5 flex w-full flex-col rounded-md border-[1.5px] bg-[#e9e6d6ac] p-1 md:min-w-fit">
              <p>Admin messages:</p>
              {messages.map((message) => {
                return <AdminMessage key={message.id} message={message} />
              })}
            </div>
          )}
        </div>
        <div className="mb-10 flex w-full flex-col rounded-md border-[1.5px] bg-[#e9e6d6ac] md:ml-5 md:max-w-3/5 md:min-w-2/5">
          <div className="mb-1 flex w-full items-center rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0d6] p-1">
            <button
              onClick={() => {
                setBlogOrActivity('blog')
              }}
              className={`flex w-fit cursor-pointer flex-row items-center rounded-sm border-[1.5px] px-1.5 py-1 text-sm active:bg-[#c1bd9a] ${blogOrActivity == 'blog' ? 'border-black bg-[#eae8dc]' : 'border-[#aaa89955] hover:bg-[#eae8dc]'}`}
            >
              Blog
            </button>
            <button
              onClick={() => {
                setBlogOrActivity('activity')
              }}
              className={`ml-2 flex w-fit cursor-pointer flex-row items-center rounded-sm border-[1.5px] px-1.5 py-1 text-sm active:bg-[#c1bd9a] ${blogOrActivity == 'activity' ? 'border-black bg-[#eae8dc]' : 'border-[#aaa89955] hover:bg-[#eae8dc]'}`}
            >
              Activity
            </button>{' '}
          </div>
          {blogOrActivity == 'blog' && (
            <div className="AddPostForm flex flex-col justify-center">
              <form onSubmit={handlePostFormSubmit} className="p-2">
                <label htmlFor="title" className="sr-only">
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Main header..."
                  value={postFormData.title}
                  onChange={handlePostFormChange}
                  className="mb-2 w-full rounded-sm border p-1"
                />
                <label htmlFor="content" className="sr-only">
                  Post content
                </label>
                <textarea
                  name="content"
                  placeholder="Content... ( tip: you can use basic html tags to style your posts, like <strong></strong> for bold text, or <pre></pre> to display ascii art! )"
                  value={postFormData.content}
                  onChange={handlePostFormChange}
                  className="mb-2 h-32 w-full rounded-sm border p-1"
                ></textarea>
                <div className="flex w-full justify-end">
                  <button
                    type="submit"
                    disabled={
                      !postFormData.title.trim() && !postFormData.content.trim()
                    }
                    className="flex cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] bg-[#eae8dc] px-2 py-1 text-sm enabled:hover:bg-[#e2e0cf] enabled:active:bg-[#c1bd9a] disabled:cursor-not-allowed disabled:text-gray-500"
                  >
                    Add Post
                  </button>
                </div>
              </form>
              <div className="mx-auto my-2 w-[94%] border border-[#aaa89955]"></div>
              {postsAreLoading && <LoadingSpinner />}
              {posts &&
                posts
                  .sort(
                    (a: PostModel, b: PostModel) =>
                      new Date(b.dateAdded).getTime() -
                      new Date(a.dateAdded).getTime(),
                  )
                  .map((post: PostModel) => {
                    return <Post post={post} key={post.id} />
                  })}
            </div>
          )}
          {blogOrActivity == 'activity' && (
            <div>
              <div className="mx-1 mt-1 mb-1 flex flex-row gap-2">
                <button
                  onClick={() => handleVisibleSectionClick('yourComments')}
                  className={`flex w-fit cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] px-1.5 py-1 text-sm active:bg-[#c1bd9a] ${visibleSection == 'yourComments' ? 'bg-[#dad7c2c1]' : 'hover:bg-[#eae8dc]'}`}
                >
                  Comments
                </button>
                <button
                  onClick={() => handleVisibleSectionClick('yourShows')}
                  className={`flex w-fit cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] px-1.5 py-1 text-sm active:bg-[#c1bd9a] ${visibleSection == 'yourShows' ? 'bg-[#dad7c2c1]' : 'hover:bg-[#eae8dc]'}`}
                >
                  Shows
                </button>
                <button
                  onClick={() => handleVisibleSectionClick('yourReplies')}
                  className={`flex w-fit cursor-pointer flex-row items-center rounded-sm border-[1.5px] border-[#aaa89955] px-1.5 py-1 text-sm active:bg-[#c1bd9a] ${visibleSection == 'yourReplies' ? 'bg-[#dad7c2c1]' : 'hover:bg-[#eae8dc]'}`}
                >
                  Replies
                </button>
              </div>
              {visibleSection == 'yourShows' && (
                <div className="YourShowsBox">
                  <div className="upcomingShowsBox p-2">
                    {showsAreLoading && <LoadingSpinner />}
                    {userShows &&
                      userShows.map((show: UpcomingShow) => (
                        <UpcomingShowCard key={show.id} show={show} />
                      ))}
                    {!showsAreLoading && userShows && userShows.length == 0 && (
                      <p>You haven&apos;t made any shows yet.</p>
                    )}
                  </div>
                </div>
              )}
              {visibleSection == 'yourComments' && (
                <div className="YourCommments">
                  <div className="commentsBox mt-1 p-2">
                    {commentsAreLoading && <LoadingSpinner />}
                    {commentsAreError && <p>Error loading comments.</p>}
                    {rootCommentsByCurrentUser.length === 0 &&
                      !commentsAreLoading && (
                        <p>You haven&apos;t made any comments yet.</p>
                      )}
                    {rootCommentsByCurrentUser.map((comment) => (
                      <div key={comment.id}>
                        <Comment
                          comment={{ ...comment, replies: [] }}
                          originIdType={
                            comment.upcomingShowId
                              ? 'upcomingShowId'
                              : comment.archiveShowId
                                ? 'archiveShowId'
                                : 'postId'
                          }
                          originId={
                            comment.upcomingShowId ||
                            comment.archiveShowId ||
                            comment.postId ||
                            0
                          }
                        />
                        <div className="mb-2 flex w-full justify-end">
                          <div className="mr-1.5 rounded-b-md border-x-2 border-b-2 border-[#dad7c2d0] bg-[#fbfaf6] px-1 py-0.5">
                            <p className="text-xs text-gray-500">
                              {comment.upcomingShowId ? (
                                <Link
                                  to={`/upcomingshows/${comment.upcomingShowId}#comment${comment.id}`}
                                >
                                  View thread
                                </Link>
                              ) : comment.archiveShowId ? (
                                <Link
                                  to={`/archive/${comment.archiveShowId}#comment${comment.id}`}
                                >
                                  View thread
                                </Link>
                              ) : (
                                <Link
                                  to={`/user/${comment.postAuthorId}#comment${comment.id}`}
                                >
                                  View thread
                                </Link>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {visibleSection == 'yourReplies' && (
                <div className="RepliesReceived">
                  <div className="commentsBox mt-1 p-2">
                    {commentsAreLoading && <LoadingSpinner />}
                    {commentsAreError && <p>Error loading comments.</p>}
                    {!commentsAreLoading && repliesReceived.length == 0 && (
                      <p>You haven&apos;t received any replies yet.</p>
                    )}
                    {repliesReceived.map((reply) => (
                      <div key={reply.id} className="flex flex-col">
                        <Comment
                          comment={{ ...reply, replies: [] }}
                          originIdType={
                            reply.upcomingShowId
                              ? 'upcomingShowId'
                              : reply.archiveShowId
                                ? 'archiveShowId'
                                : 'postId'
                          }
                          originId={
                            reply.upcomingShowId ||
                            reply.archiveShowId ||
                            reply.postId ||
                            0
                          }
                        />
                        <div className="mb-2 flex w-full justify-end">
                          <div className="mr-1.5 rounded-b-md border-x-2 border-b-2 border-[#dad7c2d0] bg-[#fbfaf6] px-1 py-0.5">
                            <p className="text-xs text-gray-500">
                              {reply.upcomingShowId ? (
                                <Link
                                  to={`/upcomingshows/${reply.upcomingShowId}#comment${reply.id}`}
                                >
                                  View thread
                                </Link>
                              ) : reply.archiveShowId ? (
                                <Link
                                  to={`/upcomingshows/${reply.archiveShowId}#comment${reply.id}`}
                                >
                                  View thread
                                </Link>
                              ) : (
                                <Link
                                  to={`/upcomingshows/${reply.postId}#comment${reply.id}`}
                                >
                                  View thread
                                </Link>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
