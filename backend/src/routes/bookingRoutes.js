import { Router } from 'express'
import { pool } from '../db.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = Router()

router.post('/', auth, async (req, res) => {
  const client = await pool.connect()

  try {
    const { flightId, passengersCount } = req.body
    const count = Number(passengersCount || 1)

    await client.query('begin')

    const flightRes = await client.query('select * from flights where id = $1 for update', [flightId])
    const flight = flightRes.rows[0]

    if (!flight) {
      await client.query('rollback')
      return res.status(404).json({ message: 'Рейс не найден' })
    }

    if (flight.seats_left < count) {
      await client.query('rollback')
      return res.status(400).json({ message: 'Недостаточно мест' })
    }

    const totalPrice = Number(flight.price) * count

    const bookingRes = await client.query(
      `insert into bookings (user_id, flight_id, passengers_count, total_price, status)
       values ($1, $2, $3, $4, 'confirmed')
       returning *`,
      [req.user.id, flightId, count, totalPrice],
    )

    await client.query(
      'update flights set seats_left = seats_left - $1 where id = $2',
      [count, flightId],
    )

    await client.query('commit')

    res.status(201).json(bookingRes.rows[0])
  } catch (error) {
    await client.query('rollback')
    res.status(500).json({ message: 'Ошибка бронирования', error: error.message })
  } finally {
    client.release()
  }
})

router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `select b.*, f.airline, f.flight_number, f.from_city, f.to_city, f.departure_time, f.arrival_time
       from bookings b
       join flights f on f.id = b.flight_id
       where b.user_id = $1
       order by b.created_at desc`,
      [req.user.id],
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения бронирований', error: error.message })
  }
})

router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      `select b.*, u.full_name, u.email, f.flight_number, f.from_city, f.to_city
       from bookings b
       join users u on u.id = b.user_id
       join flights f on f.id = b.flight_id
       order by b.created_at desc`,
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения всех бронирований', error: error.message })
  }
})

export default router
