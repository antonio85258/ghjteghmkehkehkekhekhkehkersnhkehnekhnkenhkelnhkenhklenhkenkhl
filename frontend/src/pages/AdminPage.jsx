import { useEffect, useState } from 'react'
import { api } from '../api/client'

const emptyFlight = {
  airline: '',
  flight_number: '',
  from_city: '',
  to_city: '',
  departure_time: '',
  arrival_time: '',
  price: '',
  seats_total: '',
  seats_left: '',
}

export default function AdminPage() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [flights, setFlights] = useState([])
  const [bookings, setBookings] = useState([])
  const [form, setForm] = useState(emptyFlight)
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  async function loadAll() {
    const [statsData, usersData, flightsData, bookingsData] = await Promise.all([
      api('/admin/stats'),
      api('/admin/users'),
      api('/flights'),
      api('/bookings/all'),
    ])

    setStats(statsData)
    setUsers(usersData)
    setFlights(flightsData)
    setBookings(bookingsData)
  }

  useEffect(() => {
    loadAll().catch((err) => setMessage(err.message))
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      if (editingId) {
        await api(`/flights/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        })
        setMessage('Рейс обновлён')
      } else {
        await api('/flights', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        setMessage('Рейс создан')
      }

      setForm(emptyFlight)
      setEditingId(null)
      loadAll()
    } catch (err) {
      setMessage(err.message)
    }
  }

  function startEdit(flight) {
    setEditingId(flight.id)
    setForm({
      ...flight,
      departure_time: flight.departure_time.slice(0, 16),
      arrival_time: flight.arrival_time.slice(0, 16),
    })
  }

  async function removeFlight(id) {
    try {
      await api(`/flights/${id}`, { method: 'DELETE' })
      setMessage('Рейс удалён')
      loadAll()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="container page">
      <h2>Админка</h2>
      {message && <div className="info-box">{message}</div>}

      {stats && (
        <div className="admin-stats">
          <div className="card">Пользователей: {stats.users}</div>
          <div className="card">Рейсов: {stats.flights}</div>
          <div className="card">Броней: {stats.bookings}</div>
          <div className="card">Выручка: €{stats.revenue}</div>
        </div>
      )}

      <form className="card admin-form" onSubmit={handleSubmit}>
        <h3>{editingId ? 'Редактировать рейс' : 'Добавить рейс'}</h3>
        <div className="admin-grid">
          <input placeholder="Авиакомпания" value={form.airline} onChange={(e) => setForm({ ...form, airline: e.target.value })} />
          <input placeholder="Номер рейса" value={form.flight_number} onChange={(e) => setForm({ ...form, flight_number: e.target.value })} />
          <input placeholder="Откуда" value={form.from_city} onChange={(e) => setForm({ ...form, from_city: e.target.value })} />
          <input placeholder="Куда" value={form.to_city} onChange={(e) => setForm({ ...form, to_city: e.target.value })} />
          <input type="datetime-local" value={form.departure_time} onChange={(e) => setForm({ ...form, departure_time: e.target.value })} />
          <input type="datetime-local" value={form.arrival_time} onChange={(e) => setForm({ ...form, arrival_time: e.target.value })} />
          <input placeholder="Цена" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Всего мест" value={form.seats_total} onChange={(e) => setForm({ ...form, seats_total: e.target.value })} />
          <input placeholder="Осталось мест" value={form.seats_left} onChange={(e) => setForm({ ...form, seats_left: e.target.value })} />
        </div>
        <div className="row-gap">
          <button className="btn" type="submit">Сохранить</button>
          {editingId && <button type="button" className="small-btn" onClick={() => { setEditingId(null); setForm(emptyFlight) }}>Отмена</button>}
        </div>
      </form>

      <h3>Рейсы</h3>
      <div className="cards-list">
        {flights.map((flight) => (
          <div className="card" key={flight.id}>
            <h4>{flight.from_city} → {flight.to_city}</h4>
            <p>{flight.airline} / {flight.flight_number}</p>
            <p>Цена: €{flight.price}</p>
            <p>Мест осталось: {flight.seats_left}</p>
            <div className="row-gap">
              <button className="small-btn" onClick={() => startEdit(flight)}>Редактировать</button>
              <button className="small-btn danger" onClick={() => removeFlight(flight.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      <h3>Пользователи</h3>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Бронирования</h3>
      <div className="table-wrap card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Клиент</th>
              <th>Email</th>
              <th>Маршрут</th>
              <th>Рейс</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.full_name}</td>
                <td>{item.email}</td>
                <td>{item.from_city} → {item.to_city}</td>
                <td>{item.flight_number}</td>
                <td>€{item.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
