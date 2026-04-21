export default function FlightCard({ flight, onBook, canBook }) {
  return (
    <div className="card flight-card">
      <div className="flight-top">
        <div>
          <h3>{flight.from_city} → {flight.to_city}</h3>
          <p>{flight.airline} · {flight.flight_number}</p>
        </div>
        <div className="price">€{flight.price}</div>
      </div>

      <div className="flight-grid">
        <div>
          <span className="label">Вылет</span>
          <div>{new Date(flight.departure_time).toLocaleString()}</div>
        </div>
        <div>
          <span className="label">Прилёт</span>
          <div>{new Date(flight.arrival_time).toLocaleString()}</div>
        </div>
        <div>
          <span className="label">Осталось мест</span>
          <div>{flight.seats_left}</div>
        </div>
      </div>

      <button className="btn" onClick={() => onBook(flight)} disabled={!canBook}>
        {canBook ? 'Забронировать' : 'Войдите для бронирования'}
      </button>
    </div>
  )
}
