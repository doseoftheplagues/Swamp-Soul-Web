/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import Header from './components/Header'
import Profile from './components/MyProfile'
import { ShowUploadForm } from './components/ShowUploadForm'
import { ShowEditForm } from './components/ShowEditForm'
import { UpcomingShows } from './components/UpcomingShows'
import { Register } from './components/Register'
import NotFound from './components/NotFound'
import { UpcomingShow } from './components/UpcomingShow'
import AddPosterToShow from './components/AddPosterToShow'
import UserProfile from './components/UserProfile'
import Credits from './components/Credits'
import Videos from './components/Videos'
import NewReleases from './components/NewReleases'

// const routes = createRoutesFromElements(<Route index element={<App />} />)

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/header" element={<Header scrolled={false} />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/user/:id" element={<UserProfile />} />
    <Route path="/register" element={<Register />} />
    <Route path="/showuploadform" element={<ShowUploadForm />} />
    <Route path="/showeditform/:id" element={<ShowEditForm />} />
    <Route path="/upcomingshows" element={<UpcomingShows />} />
    <Route path="/upcomingshows/:id" element={<UpcomingShow />} />
    <Route
      path="/upcomingshows/:id/#comment/:commentid"
      element={<UpcomingShow />}
    />
    <Route path="/addpostertoshow/:id" element={<AddPosterToShow />} />
    <Route path="/credits" element={<Credits />} />
    <Route path="/footage" element={<Videos />} />
    <Route path="/newreleases" element={<NewReleases />} />

    <Route path="*" element={<NotFound />} />
  </Route>,
)

export default routes
