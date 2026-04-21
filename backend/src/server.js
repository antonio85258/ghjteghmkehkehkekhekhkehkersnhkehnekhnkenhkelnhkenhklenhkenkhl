import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import authRoutes from './routes/authRoutes.js'
import flightRoutes from './routes/flightRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { registerSupportSocket } from './socket/supportSocket.js'

dotenv.config()

const app = express()
const server = http.createServer(app)

app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'API works' })
})

app.use('/api/auth', authRoutes)
app.use('/api/flights', flightRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/admin', adminRoutes)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
  },
})

registerSupportSocket(io)

const PORT = process.env.PORT || 3002
server.listen(PORT, () => {
  console.log(`Backend started at http://localhost:${PORT}`)
})
