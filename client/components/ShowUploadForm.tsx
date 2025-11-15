import DatePicker from 'react-date-picker'
import { useState } from 'react'
import { useAddUpcomingShow } from '../hooks/useUpcomingShows'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router'

export function ShowUploadForm() {
  const navigate = useNavigate()
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

  const addShowMutation = useAddUpcomingShow()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      wheelchairAccessible: formData.wheelchairAccessible === 'true',
      mobilityAccessible: formData.mobilityAccessible === 'true',
      bathroomsNearby: formData.bathroomsNearby === 'true',
      maxCapacity: parseInt(formData.maxCapacity, 10) || 0,
    }
    addShowMutation.mutate(submissionData)
    navigate('/upcomingshows')
  }

  return (
    <div>
      <h1>Required info</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date:</label>
        <br></br>
        <DatePicker
          id="date"
          onChange={handleDateChange}
          value={formData.date}
        />
        <br></br>
        <label htmlFor="doorsTime">Doors open at:</label>
        <br></br>
        <input
          type="text"
          id="doorsTime"
          name="doorsTime"
          value={formData.doorsTime}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="performers">Performers:</label>
        <br></br>
        <input
          type="text"
          id="performers"
          name="performers"
          value={formData.performers}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="locationName">Location:</label>
        <br></br>
        <input
          type="text"
          id="locationName"
          name="locationName"
          value={formData.locationName}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="noiseLevel">Noise level:</label>
        <br></br>

        <select
          id="noiseLevel"
          name="noiseLevel"
          value={formData.noiseLevel}
          onChange={handleChange}
        >
          <option value="Low">Low / safe</option>
          <option value="Medium">Medium</option>
          <option value="Loud">Loud (Bring Earplugs)</option>
        </select>
        <br></br>
        <label htmlFor="wheelchairAccessible">
          Is it wheelchair accessible? :
        </label>
        <br></br>
        <select
          id="wheelchairAccessible"
          name="wheelchairAccessible"
          value={String(formData.wheelchairAccessible)}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
        <label htmlFor="bathroomsNearby">
          Are there easily accessible bathrooms nearby? (If they are further
          than a few minutes walk away select no):
        </label>
        <br></br>
        <select
          id="bathroomsNearby"
          name="bathroomsNearby"
          value={String(formData.bathroomsNearby)}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
        <label htmlFor="mobility">
          Is the location somewhere that someone with limited mobility could
          easily access?
        </label>
        <br></br>
        <select
          id="mobility"
          name="mobilityAccessible"
          value={String(formData.mobilityAccessible)}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <br></br>
        <h2>Extra info (Optional)</h2>
        <br></br>
        <label htmlFor="locationCoords">Location coordinates:</label>
        <br></br>
        <input
          type="text"
          id="locationCoords"
          name="locationCoords"
          value={formData.locationCoords}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="setTimes">Set times:</label>
        <br></br>
        <input
          type="text"
          id="setTimes"
          name="setTimes"
          value={formData.setTimes}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="ticketsLink">Link to buy tickets:</label>
        <br></br>
        <input
          type="text"
          id="ticketsLink"
          name="ticketsLink"
          value={formData.ticketsLink}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="description">Description / bios:</label>
        <br></br>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></input>
        <br></br>
        <label htmlFor="maxCapacity">Max Capacity:</label>
        <br></br>
        <input
          type="number"
          id="maxCapacity"
          name="maxCapacity"
          value={formData.maxCapacity}
          onChange={handleChange}
        ></input>
        <br></br>
        <input type="submit" className="submitButton" value="Submit" />
      </form>
    </div>
  )
}
