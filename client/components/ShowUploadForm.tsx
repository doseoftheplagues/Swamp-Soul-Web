import { useUser } from '../hooks/useUsers'
import { useEffect, useState, forwardRef } from 'react'
import { useAddUpcomingShow } from '../hooks/useUpcomingShows'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import * as Form from '@radix-ui/react-form'
import * as Select from '@radix-ui/react-select'
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'
import DatePicker from 'react-date-picker'

export function ShowUploadForm() {
  const navigate = useNavigate()
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0()
  const { data: userDb, isLoading: isUserLoading } = useUser()
  const [coordsTooltipIsHidden, setCoordsTooltipIsHidden] = useState(true)

  useEffect(() => {
    if (!isUserLoading && isAuthenticated && !userDb) {
      navigate('/register')
    }
  }, [isUserLoading, isAuthenticated, userDb, navigate])

  const [formData, setFormData] = useState({
    date: new Date(),
    doorsTime: '',
    price: '',
    performers: '',
    locationName: '',
    wheelchairAccessible: '',
    mobilityAccessible: '',
    bathroomsNearby: '',
    noiseLevel: '',
    locationCoords: '',
    setTimes: '',
    ticketsLink: '',
    description: '',
    maxCapacity: '',
    userId: '',
    name: '',
    underageAllowed: '',
  })

  const addShowMutation = useAddUpcomingShow()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  const handleDateChange = (newDate: Date | null) => {
    if (newDate instanceof Date) {
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }))
    }
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('You need to log in to submit shows')
      return
    }
    const token = await getAccessTokenSilently()
    const submissionData = {
      ...formData,
      date: formData.date.toISOString(),
      wheelchairAccessible: formData.wheelchairAccessible === 'true',
      mobilityAccessible: formData.mobilityAccessible === 'true',
      bathroomsNearby: formData.bathroomsNearby === 'true',
      underageAllowed: formData.underageAllowed === 'true',
      maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
      userId: user!.sub,
    }
    addShowMutation.mutate(
      { showData: submissionData, token },
      {
        onSuccess: (data) => {
          const newShowId = data?.id || data?.[0]?.id

          if (newShowId) {
            navigate(`/addpostertoshow/${newShowId}`)
          } else {
            console.error('Could not get new show ID from API response.')
            navigate('/upcomingshows')
          }
        },
        onError: (error) => {
          console.error('Error adding show:', error)
          alert('There was an error submitting the show. Please try again.')
        },
      },
    )
  }

  const requiredFields: (keyof typeof formData)[] = [
    'doorsTime',
    'price',
    'performers',
    'locationName',
    'noiseLevel',
    'wheelchairAccessible',
    'bathroomsNearby',
    'mobilityAccessible',
  ]

  const isFormInvalid =
    requiredFields.some((field) => !formData[field]) || !formData.date

  if (!isAuthenticated) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <p className="mx-auto my-auto text-lg">Log in to submit shows</p>
      </div>
    )
  }

  function handleCoordsTooltipClick() {
    if (coordsTooltipIsHidden == true) {
      setCoordsTooltipIsHidden(false)
    } else {
      setCoordsTooltipIsHidden(true)
    }
  }

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Required info</h1>
      <Form.Root
        onSubmit={handleSubmit}
        className="space-y-4"
        autoComplete="off"
      >
        <Form.Field name="date" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Date:
          </Form.Label>
          <DatePicker
            id="date"
            onChange={handleDateChange}
            value={formData.date}
            required
            className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200"
          />
        </Form.Field>

        <Form.Field name="doorsTime" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Doors open at:
          </Form.Label>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please enter a time
          </Form.Message>
          <Form.Control asChild>
            <input
              type="text"
              name="doorsTime"
              value={formData.doorsTime}
              onChange={handleChange}
              required
              className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="price" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Price:
          </Form.Label>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please enter a price
          </Form.Message>
          <Form.Control asChild>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="performers" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Performers:
          </Form.Label>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please enter performers
          </Form.Message>
          <Form.Control asChild>
            <textarea
              className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
              name="performers"
              value={formData.performers}
              onChange={handleChange}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="locationName" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Location:
          </Form.Label>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please enter a location
          </Form.Message>
          <Form.Control asChild>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              required
              className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="noiseLevel" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Noise level:
          </Form.Label>
          <Select.Root
            value={formData.noiseLevel}
            onValueChange={handleSelectChange('noiseLevel')}
            required
          >
            <Select.Trigger className="focus:ring-opacity-50 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#8f9779]">
              <Select.Value placeholder="Select noise level" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-10 rounded-md bg-white py-1 shadow-lg">
                <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="Low">Low / safe</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Loud">Loud (Bring Earplugs)</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please select a noise level
          </Form.Message>
        </Form.Field>

        <Form.Field name="wheelchairAccessible" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Is it wheelchair accessible? :
          </Form.Label>
          <Select.Root
            value={String(formData.wheelchairAccessible)}
            onValueChange={handleSelectChange('wheelchairAccessible')}
            required
          >
            <Select.Trigger className="focus:ring-opacity-50 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#8f9779]">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-10 rounded-md bg-white py-1 shadow-lg">
                <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field name="bathroomsNearby" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Are there easily accessible bathrooms nearby? (If they are further
            than a few minutes walk away select no):
          </Form.Label>
          <Select.Root
            value={String(formData.bathroomsNearby)}
            onValueChange={handleSelectChange('bathroomsNearby')}
            required
          >
            <Select.Trigger className="focus:ring-opacity-50 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#8f9779]">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-10 rounded-md bg-white py-1 shadow-lg">
                <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field name="mobilityAccessible" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Is the location somewhere that someone with limited mobility could
            easily access?
          </Form.Label>
          <Select.Root
            value={String(formData.mobilityAccessible)}
            onValueChange={handleSelectChange('mobilityAccessible')}
            required
          >
            <Select.Trigger className="focus:ring-opacity-50 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#8f9779]">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-10 rounded-md bg-white py-1 shadow-lg">
                <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message
            match="valueMissing"
            className="mt-1 text-xs text-red-500"
          >
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field name="underageAllowed" className="mb-4">
          <Form.Label className="mb-1 block text-sm font-medium text-gray-700">
            Is the show r18 or all ages?
          </Form.Label>
          <Select.Root
            value={String(formData.underageAllowed)}
            onValueChange={handleSelectChange('underageAllowed')}
          >
            <Select.Trigger className="focus:ring-opacity-50 mt-1 flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#8f9779]">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="z-10 rounded-md bg-white py-1 shadow-lg">
                <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">
                    Yes, the show is all ages
                  </SelectItem>
                  <SelectItem value="false">No, it&apos;s R18</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </Form.Field>

        <h2 className="mt-6 mb-4 text-xl font-bold">Extra info (Optional)</h2>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Show name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
        />
        <div className="flex flex-row items-center justify-between">
          <label
            htmlFor="locationCoords"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Location coordinates:
          </label>
          <button
            type="button"
            onClick={() => handleCoordsTooltipClick()}
            className="ml-2 flex cursor-pointer items-center rounded-sm border border-[#aaa89955] bg-[#dad7c2] px-1 py-0 text-sm text-xs hover:bg-[#e2e0cf] active:bg-[#c1bd9a]"
          >
            How to add coordinates
          </button>
        </div>
        {coordsTooltipIsHidden == false && (
          <div className="md flex flex-col rounded border-[1.5px] bg-[#dedccabd] p-2 text-sm wrap-anywhere">
            <p className="mb-2 text-base">How to add coordinates:</p>
            <p className="mb-2">
              Open the location in maps and zoom in to where you want it.
            </p>
            <p className="mb-2">
              Your windows address will look something like:
              https://www.google.com/maps/@-41.2979987,174.7919087,20.25z?authuser=.............etc..etc...etc......etc...
            </p>
            <p className="mb-2">
              -41.2979987,174.7919087,20.25z? - this is the part we want! copy
              everything from @ till the end of the coordinates and post it into
              the form feild below. The coordinates will be displayed as a map
              link on the show page.
            </p>
          </div>
        )}
        <input
          type="text"
          id="locationCoords"
          name="locationCoords"
          value={formData.locationCoords}
          onChange={handleChange}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
        />
        <label
          htmlFor="setTimes"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Set times:
        </label>
        <input
          type="text"
          id="setTimes"
          name="setTimes"
          value={formData.setTimes}
          onChange={handleChange}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
        />
        <label
          htmlFor="ticketsLink"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Link to buy tickets:
        </label>
        <input
          type="text"
          id="ticketsLink"
          name="ticketsLink"
          value={formData.ticketsLink}
          onChange={handleChange}
          className="focus:ring-opacity-50 focus:border-swamp-green-200 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm"
        />
        <label
          htmlFor="description"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Description / bios:
        </label>
        <input
          type="text"
          maxLength={300}
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="focus:ring-opacity-50 focus:border-primary-200 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779] focus:ring-[#8f9779]"
        />
        <label
          htmlFor="maxCapacity"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Max Capacity:
        </label>
        <input
          type="number"
          id="maxCapacity"
          name="maxCapacity"
          value={formData.maxCapacity}
          onChange={handleChange}
          className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-[#8f9779]"
        />
        <Form.Submit asChild>
          <button
            className="border-transparentpx-4 mt-6 inline-flex w-full justify-center rounded-md border bg-[#dad7c2] py-2 text-sm font-medium text-[#000000] shadow-sm focus:border-[#d1d5c7] focus:bg-[#c1bd9a] focus:ring-[#8f9779] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isFormInvalid}
          >
            Submit
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  )
}

const SelectItem = forwardRef<HTMLDivElement, Select.SelectItemProps>(
  ({ children, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className="relative flex cursor-default items-center px-3 py-2 text-sm select-none data-highlighted:bg-[#dad7c2] data-highlighted:text-black data-highlighted:outline-none"
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 inline-flex items-center text-white"></Select.ItemIndicator>
      </Select.Item>
    )
  },
)
SelectItem.displayName = 'SelectItem'
