import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="logo">AviaTickets</Link>

        <nav className="menu">
          <Link to="/">Рейсы</Link>
          <Link to="/support">Поддержка</Link>

          {user && <Link to="/my-bookings">Мои брони</Link>}
          {user?.role === 'admin' && <Link to="/admin">Админка</Link>}

          {!user && <Link to="/login">Вход</Link>}
          {!user && <Link to="/register">Регистрация</Link>}

          {user && (
            <button className="small-btn" onClick={handleLogout}>
              Выйти ({user.full_name || user.fullName})
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
