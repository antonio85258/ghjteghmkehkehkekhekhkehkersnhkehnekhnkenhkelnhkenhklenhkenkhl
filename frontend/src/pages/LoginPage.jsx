import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      login(data)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container page small-page">
      <form className="card form-card" onSubmit={handleSubmit}>
        <h2>Вход</h2>
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <div className="error-box">{error}</div>}
        <button className="btn" type="submit">Войти</button>
      </form>
    </div>
  )
}
