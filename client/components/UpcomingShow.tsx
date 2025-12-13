import { useNavigate, useParams } from 'react-router'
import {
  useDeleteUpcomingShow,
  useGetUpcomingShowById,
  useUpdateUpcomingShow,
} from '../hooks/useUpcomingShows'
import { LoadingSpinner } from './SmallerComponents/LoadingSpinner'
import { useAuth0 } from '@auth0/auth0-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { useEffect, useState } from 'react'

export function UpcomingShow() {
  const [titleBackHeight, setTitleBackHeight] = useState('min-h-28')
  const [titleTextSize, setTitleTextSize] = useState('text-8xl')
  const [titleWrap, setTitleWrap] = useState('')
  const params = useParams()
  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()
  const deleteShowMutation = useDeleteUpcomingShow()
  const navigate = useNavigate()

  const editShowMutation = useUpdateUpcomingShow()

  useEffect(() => {
    if (data) {
      lengthDisplayCheck(data.performers)
    }
  }, [data])

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (isError) {
    return <p>an error occured</p>
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-NZ', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  async function handleDeleteClick(id: number) {
    const token = await getAccessTokenSilently()
    if (!isAuthenticated) {
      alert('You need to log in to delete shows')
    }
    deleteShowMutation.mutate({ id, token })
    navigate('/upcomingshows')
  }

  const handleEditClick = (id: number) => {
    navigate(`/showeditform/${id}`)
  }

  const handleCancelClick = async (
    id: number,
    isCurrentlyCanceled: boolean,
  ) => {
    const token = await getAccessTokenSilently()
    const showData = {
      canceled: !isCurrentlyCanceled,
    }
    editShowMutation.mutate({
      id: id,
      token,
      showData: showData,
    })
    navigate(`/upcomingshows`)
  }

  const lengthDisplayCheck = (input: string) => {
    console.log(input.length)
    if (input.length > 25) {
      setTitleBackHeight('min-h-44')
    }
    if (input.length > 50 && input.length < 70) {
      setTitleTextSize('text-7xl')
      setTitleWrap('wrap-break-word')
      setTitleBackHeight('min-h-40')
    }
    if (input.length > 70) {
      setTitleTextSize('text-5xl')
      setTitleWrap('wrap-anywhere')
      setTitleBackHeight('min-h-48')
    }
  }

  // NOTE performers text breaks at 20-23 max

  return (
    <div>
      <div className="large-screen h- hidden sm:flex">
        <div className="h- flex h-auto w-screen flex-row bg-amber-500">
          <div
            className={`infoDiv flex w-3/5 flex-col bg-amber-200 ${titleBackHeight}`}
          >
            <div>
              <div className="performerNameHeader absolute top-11 left-3 z-10 w-4/5 text-wrap wrap-normal">
                <h2 className={`${titleTextSize} text-wrap ${titleWrap}`}>
                  {data.performers}
                </h2>
              </div>
              <div className="3/5 mt-4 bg-emerald-300">
                <p>
                  {data.locationName} ₊✩‧₊ {formatDate(data.date)}
                </p>
              </div>
              <p></p>
            </div>
          </div>
          <div className="posterDiv"></div>
        </div>
      </div>
      <div className="phone-screen flex sm:hidden">
        <p>Smallscreen</p>
      </div>
    </div>
  )

  // return (
  //   <div className="flex w-screen flex-col sm:mt-6 sm:flex-row">
  //     <div className="flex w-full flex-col justify-center sm:flex-row">
  //       <div className="flex w-screen flex-col justify-center sm:flex-row">
  //         <div className="flex flex-col sm:flex-row sm:rounded-xs sm:border sm:border-[#dad6b4c1] sm:shadow">
  //           <div className="flex place-content-center items-center align-middle">
  //             <img
  //               className="sm:object-fit h-72 sm:h-180"
  //               src="../posters/valhallaJuly10th.jpg"
  //               alt={data.locationName + ' ' + data.date + ' ' + 'poster'}
  //             ></img>
  //           </div>
  //           <div className="flex w-full flex-col text-left text-wrap wrap-break-word sm:w-130">
  //             {Boolean(data.canceled) && (
  //               <div className="w-full bg-[#f68484] p-1 text-center">
  //                 This show has been cancelled
  //               </div>
  //             )}
  //             <div className="">
  //               {data.name && (
  //                 <div className="text-center">
  //                   <h1 className="bg-[#dad7c28c] p-1 text-xl wrap-break-word sm:text-2xl">
  //                     ⋆✩ {data.name} ✩｡
  //                   </h1>

  //                   <h1 className="bg-[#dad7c28c] p-1 text-lg wrap-break-word sm:text-xl">
  //                     {data.performers}
  //                   </h1>
  //                 </div>
  //               )}
  //               {!data.name && (
  //                 <div className="text-center">
  //                   <h1 className="bg-[#dad7c28c] p-2 text-xl wrap-break-word sm:text-2xl">
  //                     {data.performers}
  //                   </h1>
  //                 </div>
  //               )}

  //               <div className="flex w-full flex-col">
  //                 <div className="text-center">
  //                   <p className="bg-[#eaeae05e] p-2 text-center text-base whitespace-pre-line">
  //                     {data.locationName} ₊✩‧₊ {formatDate(data.date)}
  //                   </p>
  //                 </div>
  //                 <div className="flex flex-row">
  //                   <div className="mt-2 flex w-1/2 flex-col bg-[#eaeae066] p-2">
  //                     <p className="text-[#414141e8]">Doors </p>
  //                     <p className="my-1"> {data.doorsTime} </p>
  //                     {data.setTimes && (
  //                       <div>
  //                         <p className="text-[#414141e8]">Set times </p>
  //                         <p className="my-1"> {data.setTimes} </p>
  //                       </div>
  //                     )}
  //                     <p className="text-[#414141e8]">Entry </p>
  //                     <p className="my-1"> {data.price} </p>
  //                   </div>
  //                   <div className="mt-2 flex w-1/2 flex-col border-l-2 border-[#dad7c2] p-2 text-right">
  //                     <p>Noise level</p>
  //                     <p className="my-1">[ {data.noiseLevel} ]</p>
  //                     <p>Bathrooms nearby?</p>
  //                     <p className="my-1">
  //                       [ {data.bathroomsNearby ? 'Yes' : 'No'} ]
  //                     </p>
  //                     <p>Wheelchair access?</p>
  //                     <p className="my-1">
  //                       [ {data.wheelchairAccessible ? 'Yes' : 'No'} ]
  //                     </p>
  //                     <p>Limited mobility access?</p>
  //                     <p className="my-1">
  //                       [ {data.mobilityAccessible ? 'Yes' : 'No'} ]
  //                     </p>
  //                   </div>
  //                 </div>
  //               </div>

  //
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}

// {isAuthenticated && (
//                 <div>
//                   <AlertDialog.Root>
//                     <AlertDialog.Trigger asChild>
//                       <button className="">Delete show</button>
//                     </AlertDialog.Trigger>
//                     <AlertDialog.Portal>
//                       <AlertDialog.Overlay className="AlertDialogOverlay" />
//                       <AlertDialog.Content className="AlertDialogContent">
//                         <AlertDialog.Title className="AlertDialogTitle">
//                           Are you sure?
//                         </AlertDialog.Title>
//                         <AlertDialog.Description className="AlertDialogDescription">
//                           This action cannot be undone. This will permanently
//                           delete this show and its data from our server. If the
//                           show is cancelled please select cancel instead to
//                           notify attendees of the change.
//                         </AlertDialog.Description>
//                         <div
//                           style={{
//                             display: 'flex',
//                             gap: 25,
//                             justifyContent: 'flex-end',
//                           }}
//                         >
//                           <AlertDialog.Cancel asChild>
//                             <button className="Button mauve">Cancel</button>
//                           </AlertDialog.Cancel>
//                           <AlertDialog.Action asChild>
//                             <button
//                               className="rounded-sm bg-red-400 p-2"
//                               onClick={() => handleDeleteClick(data.id)}
//                             >
//                               Yes, delete show
//                             </button>
//                           </AlertDialog.Action>
//                         </div>
//                       </AlertDialog.Content>
//                     </AlertDialog.Portal>
//                   </AlertDialog.Root>
//                   <br />
//                   <button onClick={() => handleEditClick(data.id)}>Edit</button>
//                 </div>
//               )}
