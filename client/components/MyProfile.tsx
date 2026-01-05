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

const Profile = () => {
  const { deleteImage } = useImage()
  const [editPfpIsHidden, setEditPfpIsHidden] = useState(true)
  const [editDetailsIsHidden, setEditDetailsIsHidden] = useState(true)
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { data, update } = useUser()
  const userLoaded = user?.sub

  // Fetch user's upcoming shows
  const {
    data: userShows,
    isLoading: showsAreLoading,
    isError: showsAreError,
  } = useGetUpcomingShowsByUserId(userLoaded)

  // Fetch user's comments and replies to them
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
    return <p>Log in to view your profile</p>
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
    <div className="flex w-screen flex-row items-start justify-center">
      <div className="relative flex flex-col rounded-md border-[1.5px] bg-[#e9e6d6ac] md:w-4/9 lg:w-2/9">
        <div className="dropdo2n absolute right-0">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="IconButton" aria-label="Customise options">
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
                        !editPfpIsHidden || (!editDetailsIsHidden && true)
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
                      disabled={!editDetailsIsHidden && true}
                    >
                      Edit profile picture
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
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
        {!editDetailsIsHidden && (
          <div>
            <EditProfile setEditDetailsIsHidden={setEditDetailsIsHidden} />
          </div>
        )}
        {editDetailsIsHidden && (
          <div className="STUFFDIV">
            <div>
              {data?.admin && (
                <p className="text-md rounded-t-md border-b bg-[#e1bebe9f] pr-2 text-right text-[#424242]">
                  Site Admin
                </p>
              )}
            </div>
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
                className={`place-content-center pr-1 pl-0.5 ${!editPfpIsHidden && 'hidden'}`}
              >
                <div className="flex flex-row">
                  <p className="text-xl font-bold">
                    {data?.username}{' '}
                    <span className="ml-1 text-base font-normal wrap-anywhere text-[#444] italic">
                      {data?.status}
                    </span>
                  </p>
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
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="ml-5 flex w-fit min-w-2/5 flex-col rounded-md border bg-[#e9e6d6ac]">
        <div className="mb-1 flex w-full items-center justify-between rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0d6] p-1">
          <p className=""> Your Shows</p>
        </div>
        <div className="upcomingShowsBox p-1">
          {showsAreLoading && <LoadingSpinner />}
          {userShows &&
            userShows.map((show: UpcomingShow) => (
              <UpcomingShowCard key={show.id} show={show} />
            ))}
          {!showsAreLoading && userShows && userShows.length == 0 && (
            <p>You haven&apos;t made any shows yet.</p>
          )}
        </div>
        <div className="YourCommments">
          <div className="mb-1 flex w-full items-center justify-between rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0d6] p-1">
            <p className=""> Your Comments</p>
          </div>
          <div className="commentsBox mt-1 p-2">
            {commentsAreLoading && <LoadingSpinner />}
            {commentsAreError && <p>Error loading comments.</p>}
            {rootCommentsByCurrentUser.length === 0 && !commentsAreLoading && (
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
                          to={`/upcomingshows/${comment.archiveShowId}#comment${comment.id}`}
                        >
                          View thread
                        </Link>
                      ) : (
                        <Link
                          to={`/upcomingshows/${comment.postId}#comment${comment.id}`}
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
        <div className="RepliesReceived">
          <div className="mt-4 mb-1 flex w-full items-center justify-between rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0d6] p-1">
            <p className=""> Replies Received</p>
          </div>
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
      </div>
    </div>
  ) : null
}

export default Profile
