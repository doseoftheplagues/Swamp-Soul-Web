import { useAuth0 } from '@auth0/auth0-react'
import { useUser } from '../hooks/useUsers'
import { Link } from 'react-router'
import { ProfilePlaceholder } from './SmallerComponents/ProfilePlaceholder'
import { useState } from 'react'
import { FileUploader } from './SmallerComponents/FileUploader'

const Profile = () => {
  const [editPfpIsHidden, setEditPfpIsHidden] = useState(true)
  const { user, isAuthenticated, isLoading } = useAuth0()
  const { data } = useUser()

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

  function handleImageUrlReceived() {
    console.log('meow')
  }

  return isAuthenticated && user ? (
    <div className="p-2">
      <div className="flex w-2/9 flex-col rounded-md border bg-[#e9e6d6ac]">
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
                className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100"
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
          {editPfpIsHidden && (
            <button className="mt-1 mr-2 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none">
              <Link to={'/editprofile'}>Edit details</Link>
            </button>
          )}
          {editPfpIsHidden && (
            <button
              className="mt-1 inline-flex w-fit justify-center rounded-sm border border-black bg-[#faf8f1] p-1 text-sm font-medium text-black shadow-sm focus:ring-offset-2 focus:outline-none"
              onClick={() => handleEditPfpClick()}
            >
              Edit profile picture
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null
}

export default Profile
