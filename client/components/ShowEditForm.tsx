import DatePicker from 'react-date-picker'
import { useEffect, useState, forwardRef } from 'react'
import {
  useGetUpcomingShowById,
  useUpdateUpcomingShow,
} from '../hooks/useUpcomingShows'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router'
import { useAuth0 } from '@auth0/auth0-react'
import * as Form from '@radix-ui/react-form'
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons'

export function ShowEditForm() {
  const params = useParams()
  const navigate = useNavigate()
  const { getAccessTokenSilently } = useAuth0()

  const { data, isLoading, isError } = useGetUpcomingShowById(Number(params.id))
  const [formData, setFormData] = useState({
    date: new Date(),
    doorsTime: '',
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
  })

  const editShowMutation = useUpdateUpcomingShow()

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

  useEffect(() => {
    if (data) {
      setFormData({
        date: data.date ? new Date(data.date) : new Date(),
        doorsTime: data.doorsTime || '',
        performers: data.performers || '',
        locationName: data.locationName || '',
        wheelchairAccessible: String(data.wheelchairAccessible) || '',
        mobilityAccessible: String(data.mobilityAccessible) || '',
        bathroomsNearby: String(data.bathroomsNearby) || '',
        noiseLevel: data.noiseLevel || '',
        locationCoords: data.locationCoords || '',
        setTimes: data.setTimes || '',
        ticketsLink: data.ticketsLink || '',
        description: data.description || '',
        maxCapacity: String(data.maxCapacity) || '',
      })
    }
  }, [data])

  if (isLoading) {
    return <p>loading...</p>
  }
  if (isError) {
    return <p>an error occured</p>
  }
  const handleDateChange = (newDate: Date | null) => {
    if (newDate instanceof Date) {
      setFormData((prev) => ({
        ...prev,
        date: newDate,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const currentId = Number(params.id)
    const token = await getAccessTokenSilently()
    const submissionData = {
      ...formData,
      wheelchairAccessible: formData.wheelchairAccessible === 'true',
      mobilityAccessible: formData.mobilityAccessible === 'true',
      bathroomsNearby: formData.bathroomsNearby === 'true',
      maxCapacity: parseInt(formData.maxCapacity, 10) || null,
    }
    editShowMutation.mutate({ id: currentId, data: submissionData, token })
    navigate('/upcomingshows')
  }

  const requiredFields: (keyof typeof formData)[] = [
    'doorsTime',
    'performers',
    'locationName',
    'noiseLevel',
    'wheelchairAccessible',
    'bathroomsNearby',
    'mobilityAccessible',
  ]

  const isFormInvalid =
    requiredFields.some((field) => !formData[field]) || !formData.date

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Required info</h1>
      <Form.Root onSubmit={handleSubmit} className="space-y-4">
        <Form.Field name="date" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Date:
          </Form.Label>
          <DatePicker
            id="date"
            onChange={handleDateChange}
            value={formData.date}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
          />
        </Form.Field>

        <Form.Field name="doorsTime" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Doors open at:
          </Form.Label>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please enter a time
          </Form.Message>
          <Form.Control asChild>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              name="doorsTime"
              value={formData.doorsTime}
              onChange={handleChange}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="performers" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Performers:
          </Form.Label>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please enter performers
          </Form.Message>
          <Form.Control asChild>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              type="text"
              name="performers"
              value={formData.performers}
              onChange={handleChange}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="locationName" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Location:
          </Form.Label>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please enter a location
          </Form.Message>
          <Form.Control asChild>
            <input
              type="text"
              name="locationName"
              value={formData.locationName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="noiseLevel" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Noise level:
          </Form.Label>
          <Select.Root
            value={formData.noiseLevel}
            onValueChange={handleSelectChange('noiseLevel')}
            required
          >
            <Select.Trigger className="flex items-center justify-between mt-1 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <Select.Value placeholder="Select noise level" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg py-1 z-10">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="Low">Low / safe</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Loud">Loud (Bring Earplugs)</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please select a noise level
          </Form.Message>
        </Form.Field>

        <Form.Field name="wheelchairAccessible" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Is it wheelchair accessible? :
          </Form.Label>
          <Select.Root
            value={String(formData.wheelchairAccessible)}
            onValueChange={handleSelectChange('wheelchairAccessible')}
            required
          >
            <Select.Trigger className="flex items-center justify-between mt-1 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg py-1 z-10">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field name="bathroomsNearby" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Are there easily accessible bathrooms nearby? (If they are further
            than a few minutes walk away select no):
          </Form.Label>
          <Select.Root
            value={String(formData.bathroomsNearby)}
            onValueChange={handleSelectChange('bathroomsNearby')}
            required
          >
            <Select.Trigger className="flex items-center justify-between mt-1 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg py-1 z-10">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please select an option
          </Form.Message>
        </Form.Field>

        <Form.Field name="mobilityAccessible" className="mb-4">
          <Form.Label className="block text-sm font-medium text-gray-700 mb-1">
            Is the location somewhere that someone with limited mobility could
            easily access?
          </Form.Label>
          <Select.Root
            value={String(formData.mobilityAccessible)}
            onValueChange={handleSelectChange('mobilityAccessible')}
            required
          >
            <Select.Trigger className="flex items-center justify-between mt-1 w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <Select.Value placeholder="Select an option" />
              <Select.Icon className="h-4 w-4 text-gray-400">
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-md shadow-lg py-1 z-10">
                <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport className="p-1">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </Select.Viewport>
                <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700">
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
          <Form.Message match="valueMissing" className="text-red-500 text-xs mt-1">
            Please select an option
          </Form.Message>
        </Form.Field>

        <h2 className="text-xl font-bold mt-6 mb-4">Extra info (Optional)</h2>
        <label htmlFor="locationCoords" className="block text-sm font-medium text-gray-700 mb-1">Location coordinates:</label>
        <input
          type="text"
          id="locationCoords"
          name="locationCoords"
          value={formData.locationCoords}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
        />
        <label htmlFor="setTimes" className="block text-sm font-medium text-gray-700 mb-1">Set times:</label>
        <input
          type="text"
          id="setTimes"
          name="setTimes"
          value={formData.setTimes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
        />
        <label htmlFor="ticketsLink" className="block text-sm font-medium text-gray-700 mb-1">Link to buy tickets:</label>
        <input
          type="text"
          id="ticketsLink"
          name="ticketsLink"
          value={formData.ticketsLink}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
        />
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description / bios:</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
        />
        <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">Max Capacity:</label>
        <input
          type="number"
          id="maxCapacity"
          name="maxCapacity"
          value={formData.maxCapacity}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
        />
        <Form.Submit asChild>
          <button className="mt-6 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isFormInvalid}>
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
      <Select.Item className="text-sm py-2 px-3 relative flex items-center cursor-default select-none data-[highlighted]:bg-indigo-600 data-[highlighted]:text-white data-[highlighted]:outline-none" {...props} ref={forwardedRef}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-2 inline-flex items-center text-white">
          <CheckIcon className="h-4 w-4" />
        </Select.ItemIndicator>
      </Select.Item>
    )
  }
)
SelectItem.displayName = 'SelectItem'
