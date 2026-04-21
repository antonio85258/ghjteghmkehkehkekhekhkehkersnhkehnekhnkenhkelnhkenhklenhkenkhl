import jwt from 'jsonwebtoken'

export function auth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нужна авторизация' })
  }

  const token = header.split(' ')[1]

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Невалидный токен' })
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для admin' })
  }

  next()
}
