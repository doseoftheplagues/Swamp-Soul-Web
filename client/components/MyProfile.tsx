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

const Profile = () => {
  const { deleteImage } = useImage()
  const [editPfpIsHidden, setEditPfpIsHidden] = useState(true)
  const [editDetailsIsHidden, setEditDetailsIsHidden] = useState(true)
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { data, update } = useUser()
  const userLoaded = user?.sub
  const {
    data: userShows,
    isLoading: showsAreLoading,
    isError: showsAreError,
  } = useGetUpcomingShowsByUserId(userLoaded)

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

        {/* <div className="BUTTONDIV p-2">
          {editDetailsIsHidden && (
            <button
              className="mt-1 mr-2 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none disabled:border-neutral-300 disabled:text-gray-300"
              disabled={!editPfpIsHidden || (!editDetailsIsHidden && true)}
              onClick={() => handleEditDetailsCLick()}
            >
              Edit Details
            </button>
          )}

          {!editDetailsIsHidden && (
            <button
              className="mt-1 mr-2 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none"
              onClick={() => handleEditDetailsCLick()}
            >
              Cancel
            </button>
          )}

          {editPfpIsHidden && (
            <button
              className="mt-1 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none disabled:border-neutral-300 disabled:text-gray-300"
              onClick={() => handleEditPfpClick()}
              disabled={!editDetailsIsHidden && true}
            >
              Edit profile picture
            </button>
          )}
          {!editPfpIsHidden && (
            <button
              className="mt-1 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none"
              onClick={() => handleEditPfpClick()}
            >
              Cancel
            </button>
          )}
        </div> */}
      </div>
      <div className="ml-5 flex w-fit min-w-1/5 flex-col rounded-md border bg-[#e9e6d6ac]">
        <div className="mb-1 flex w-full items-center justify-between rounded-t-sm border-b-[1.5px] border-b-[#0202025f] bg-[#d9d7c0] p-1">
          <p className="font-bold"> Activity</p>
        </div>
        <div className="upcomingShowsBox mt-1 p-2">
          {showsAreLoading && <LoadingSpinner />}
          {userShows &&
            userShows.map((show: UpcomingShow) => (
              <UpcomingShowCard key={show.id} show={show} />
            ))}
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
