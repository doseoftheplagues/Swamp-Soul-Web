import express from 'express'
import * as Path from 'node:path'
import 'dotenv/config' // Cleaner way to load dotenv
import { fileURLToPath } from 'node:url'
import showRoutes from './routes/shows.ts'
import upcomingShowsRoutes from './routes/upcomingShows.ts'
import userRoutes from './routes/users.ts'
import adminRoutes from './routes/admin.ts'
import uploadRoutes from './routes/upload.ts'
import posterRoutes from './routes/posters.ts'
import commentRoutes from './routes/comments.ts'
import postRoutes from './routes/posts.ts'
import linkRoutes from './routes/links.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = Path.dirname(__filename)

const server = express()

server.use(express.json())

// --- API Routes ---
server.use('/api/v1/shows', showRoutes)
server.use('/api/v1/users', userRoutes)
server.use('/api/v1/upcomingshows', upcomingShowsRoutes)
server.use('/api/v1/upload', uploadRoutes)
server.use('/api/v1/GW2QZg7Gj6CW', adminRoutes)
server.use('/api/v1/posters', posterRoutes)
server.use('/api/v1/comments', commentRoutes)
server.use('/api/v1/posts', postRoutes)
server.use('/api/v1/links', linkRoutes)

// --- Production Static Files & Routing ---
if (process.env.NODE_ENV === 'production') {
  // We point directly to the /app/dist folder we found earlier
  const distPath = Path.resolve(__dirname, '../dist')
  const publicPath = Path.resolve(__dirname, '../public')

  server.use(express.static(publicPath))
  server.use(express.static(distPath))

  server.get('*', (req, res) => {
    res.sendFile(Path.join(distPath, 'index.html'))
  })
}

export default server
