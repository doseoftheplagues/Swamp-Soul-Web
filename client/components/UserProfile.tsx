import { useParams } from 'react-router'
import { useUserById } from '../hooks/useUsers'
import { ProfilePlaceholder } from './SmallerComponents/ProfilePlaceholder'

const UserProfile = () => {
  const params = useParams()
  const { data, isLoading } = useUserById(params.id!)

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>
  }

  return data ? (
    <div className="flex w-full flex-col items-start justify-center p-2 md:flex-row md:p-0">
      <div className="relative mr-2 mb-2 flex w-full flex-col rounded-md border-[1.5px] bg-[#e9e6d6ac] md:mr-0 md:mb-0 md:w-md">
        <div className="STUFFDIV">
          <div>
            {data?.admin && (
              <p className="text-md rounded-t-md border-b bg-[#e1bebe9f] pr-2 text-right text-[#424242]">
                Site Admin
              </p>
            )}
          </div>
          <div className="usernamePfpBanner mt-2 flex flex-row items-center gap-1">
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
            <div className="flex flex-row">
              <p className="text-xl font-bold">
                {data?.username}{' '}
                <span className="ml-1 text-base font-normal wrap-anywhere text-[#444] italic">
                  {data?.status}
                </span>
              </p>
            </div>
          </div>
          <div className="p-2">
            <div className="">
              <p className={`'text-[#faf8f1]'} text-pretty`}>{data?.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default UserProfile
