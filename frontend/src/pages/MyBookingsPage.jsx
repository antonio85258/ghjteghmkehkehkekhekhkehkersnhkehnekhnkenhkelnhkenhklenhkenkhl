import { useEffect, useState } from 'react'
import { api } from '../api/client'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api('/bookings/my')
      .then(setBookings)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="container page">
      <h2>Мои бронирования</h2>
      {error && <div className="error-box">{error}</div>}

      <div className="cards-list">
        {bookings.map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.from_city} → {item.to_city}</h3>
            <p>Рейс: {item.flight_number}</p>
            <p>Авиакомпания: {item.airline}</p>
            <p>Пассажиров: {item.passengers_count}</p>
            <p>Сумма: €{item.total_price}</p>
            <p>Статус: {item.status}</p>
            <p>Вылет: {new Date(item.departure_time).toLocaleString()}</p>
          </div>
        ))}

        {bookings.length === 0 && <div className="card">У вас пока нет бронирований</div>}
      </div>
    </div>
  )
}
