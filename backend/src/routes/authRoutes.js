import { Router } from 'express'
import { pool } from '../db.js'
import { hashPassword, comparePassword } from '../utils/hash.js'
import { createToken } from '../utils/token.js'
import { auth } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Заполните все поля' })
    }

    const existing = await pool.query('select id from users where email = $1', [email])

    if (existing.rows[0]) {
      return res.status(400).json({ message: 'Почта уже занята' })
    }

    const passwordHash = hashPassword(password)

    const result = await pool.query(
      `insert into users (full_name, email, password_hash, role)
       values ($1, $2, $3, 'user')
       returning id, full_name, email, role`,
      [fullName, email, passwordHash],
    )

    const user = result.rows[0]
    const token = createToken(user)

    res.status(201).json({ token, user })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка регистрации', error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const result = await pool.query('select * from users where email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const ok = comparePassword(password, user.password_hash)

    if (!ok) {
      return res.status(400).json({ message: 'Неверный пароль' })
    }

    const token = createToken(user)

    res.json({
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Ошибка входа', error: error.message })
  }
})

router.get('/me', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'select id, full_name, email, role, created_at from users where id = $1',
      [req.user.id],
    )

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Ошибка получения профиля', error: error.message })
  }
})

export default router
