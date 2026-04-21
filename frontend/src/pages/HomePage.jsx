import { useEffect, useState } from 'react'
import { api } from '../api/client'
import FlightCard from '../components/FlightCard'
import { useAuth } from '../context/AuthContext'

export default function HomePage() {
  const [flights, setFlights] = useState([])
  const [form, setForm] = useState({ from: '', to: '', date: '' })
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  async function loadFlights() {
    const params = new URLSearchParams()
    if (form.from) params.append('from', form.from)
    if (form.to) params.append('to', form.to)
    if (form.date) params.append('date', form.date)

    const data = await api(`/flights?${params.toString()}`)
    setFlights(data)
  }

  useEffect(() => {
    loadFlights()
  }, [])

  async function handleBook(flight) {
    try {
      await api('/bookings', {
        method: 'POST',
        body: JSON.stringify({ flightId: flight.id, passengersCount: 1 }),
      })
      setMessage('Бронирование прошло успешно')
      loadFlights()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="container page">
      <section className="hero-block">
        <h1>Найдите билеты по нормальной цене</h1>
        <p>Учебный аналог aviasales: поиск рейсов, бронирование, личный кабинет и админка.</p>
      </section>

      <section className="search-box card">
        <div className="search-grid">
          <input placeholder="Откуда" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
          <input placeholder="Куда" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <button className="btn" onClick={loadFlights}>Найти</button>
        </div>
      </section>

      {message && <div className="info-box">{message}</div>}

      <section className="cards-list">
        {flights.length === 0 && <div className="card">Рейсы не найдены</div>}
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBook={handleBook} canBook={!!user} />
        ))}
      </section>
    </div>
  )
}
