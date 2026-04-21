import { Router } from 'express'
import { pool } from '../db.js'
import { auth, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query

    let sql = `select * from flights where 1=1`
    const values = []

    if (from) {
      values.push(`%${from}%`)
      sql += ` and lower(from_city) like lower($${values.length})`
    }

    if (to) {
      values.push(`%${to}%`)
      sql += ` and lower(to_city) like lower($${values.length})`
    }

    if (date) {
      values.push(date)
      sql += ` and date(departure_time) = $${values.length}`
    }

    sql += ` order by departure_time asc`

    const result = await pool.query(sql, values)
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения рейсов', error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('select * from flights where id = $1', [req.params.id])
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения рейса', error: error.message })
  }
})

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      airline,
      flight_number,
      from_city,
      to_city,
      departure_time,
      arrival_time,
      price,
      seats_total,
      seats_left,
    } = req.body

    const result = await pool.query(
      `insert into flights (
        airline, flight_number, from_city, to_city,
        departure_time, arrival_time, price, seats_total, seats_left
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      returning *`,
      [
        airline,
        flight_number,
        from_city,
        to_city,
        departure_time,
        arrival_time,
        price,
        seats_total,
        seats_left,
      ],
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Ошибка создания рейса', error: error.message })
  }
})

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const {
      airline,
      flight_number,
      from_city,
      to_city,
      departure_time,
      arrival_time,
      price,
      seats_total,
      seats_left,
    } = req.body

    const result = await pool.query(
      `update flights set
        airline = $1,
        flight_number = $2,
        from_city = $3,
        to_city = $4,
        departure_time = $5,
        arrival_time = $6,
        price = $7,
        seats_total = $8,
        seats_left = $9
      where id = $10
      returning *`,
      [
        airline,
        flight_number,
        from_city,
        to_city,
        departure_time,
        arrival_time,
        price,
        seats_total,
        seats_left,
        req.params.id,
      ],
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Ошибка обновления рейса', error: error.message })
  }
})

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('delete from flights where id = $1', [req.params.id])
    res.json({ message: 'Рейс удалён' })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка удаления рейса', error: error.message })
  }
})

export default router
