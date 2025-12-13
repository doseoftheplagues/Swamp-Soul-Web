import express from 'express'
import * as Path from 'node:path'

import showRoutes from './routes/shows.ts'
import upcomingShowsRoutes from './routes/upcomingShows.ts'
import userRoutes from './routes/users.ts'
import adminRoutes from './routes/admin.ts'

const server = express()

server.use(express.json())

server.use('/api/v1/shows', showRoutes)
server.use('/api/v1/users', userRoutes)
server.use('/api/v1/upcomingshows', upcomingShowsRoutes)
server.use('/api/v1/GW2QZg7Gj6CW', adminRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

if (process.env.NODE_ENV !== 'production') {
  import('dotenv')
    .then((dotenv) => dotenv.config())
    .catch((err) => {
      console.error('Failed to load dotenv: ', err)
    })
}

export default server
