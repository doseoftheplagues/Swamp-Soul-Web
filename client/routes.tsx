/* eslint-disable react/jsx-key */
import { createRoutesFromElements, Route } from 'react-router'
import App from './components/App'
import Home from './components/Home'
import { Archive } from './components/Archive'

// const routes = createRoutesFromElements(<Route index element={<App />} />)

const routes = createRoutesFromElements(
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="/archive" element={<Archive />} />
  </Route>,
)

export default routes
