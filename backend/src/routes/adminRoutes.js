import { Router } from 'express'
import { pool } from '../db.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = Router()

router.use(auth, adminOnly)

router.get('/stats', async (_req, res) => {
  try {
    const [users, flights, bookings, revenue] = await Promise.all([
      pool.query('select count(*)::int as count from users'),
      pool.query('select count(*)::int as count from flights'),
      pool.query('select count(*)::int as count from bookings'),
      pool.query('select coalesce(sum(total_price), 0)::numeric as sum from bookings'),
    ])

    res.json({
      users: users.rows[0].count,
      flights: flights.rows[0].count,
      bookings: bookings.rows[0].count,
      revenue: revenue.rows[0].sum,
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка статистики', error: error.message })
  }
})

router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query(
      'select id, full_name, email, role, created_at from users order by created_at desc',
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения пользователей', error: error.message })
  }
})

export default router
