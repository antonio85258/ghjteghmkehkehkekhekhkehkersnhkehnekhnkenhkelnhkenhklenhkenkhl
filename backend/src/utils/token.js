import jwt from 'jsonwebtoken'

export function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
  )
}
