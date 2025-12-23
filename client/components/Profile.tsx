import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { ProfilePlaceholder } from './SmallerComponents/ProfilePlaceholder'
import { useState } from 'react'
import { FileUploader } from './SmallerComponents/FileUploader'
import EditProfile from './EditProfile'

const Profile = () => {
  const [editPfpIsHidden, setEditPfpIsHidden] = useState(true)
  const [editDetailsIsHidden, setEditDetailsIsHidden] = useState(true)
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
    useAuth0()
  const { data, update } = useUser()

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
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
      console.log('updating pfp to ' + url)
      const token = await getAccessTokenSilently()
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
    <div className="p-2">
      <div className="flex flex-col rounded-md border bg-[#e9e6d6ac] md:w-4/9 lg:w-2/9">
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
            <div className="mt-2 flex flex-row">
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
                  <p className="text-xl font-bold">{data?.username} </p>
                  <p className="text-md mt-[3px] ml-2">{data?.status}</p>
                </div>
                <p className="-mt-1 italic opacity-80">{user.email}</p>
              </div>
            </div>
            <div className="p-2">
              <div className="">
                <p className={`${!editPfpIsHidden && 'text-[#faf8f1]'}`}>
                  {data?.bio}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="BUTTONDIV p-2">
          <button
            className="mt-1 mr-2 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none disabled:border-neutral-300 disabled:text-gray-300"
            disabled={!editPfpIsHidden || (!editDetailsIsHidden && true)}
            onClick={() => handleEditDetailsCLick()}
          >
            Edit Details
          </button>

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
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
