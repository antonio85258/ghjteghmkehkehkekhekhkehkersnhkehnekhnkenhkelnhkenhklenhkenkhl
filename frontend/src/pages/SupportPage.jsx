import { useEffect, useMemo, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

export default function SupportPage() {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3002'
  const { user } = useAuth()
  const [status, setStatus] = useState('offline')
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const endRef = useRef(null)

  const room = useMemo(() => {
    if (user?.role === 'admin') return 'public-support'
    return user ? `support-user-${user.id}` : 'public-support'
  }, [user])

  useEffect(() => {
    const socket = io(socketUrl)
    setStatus('connecting')

    socket.on('connect', () => {
      setStatus('connected')
      socket.emit('support:join', {
        room,
        nickname: user?.full_name || user?.fullName || 'guest',
        role: user?.role || 'user',
      })
    })

    socket.on('support:message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on('disconnect', () => setStatus('offline'))

    return () => socket.disconnect()
  }, [room, socketUrl, user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!text.trim()) return
    const socket = io(socketUrl)
    socket.emit('support:join', {
      room,
      nickname: user?.full_name || user?.fullName || 'guest',
      role: user?.role || 'user',
    })
    socket.emit('support:message', text)
    setText('')
    setTimeout(() => socket.disconnect(), 300)
  }

  return (
    <div className="container page">
      <h2>Чат поддержки</h2>
      <p>Статус: <b>{status}</b></p>

      <div className="chat-box card">
        <div className="chat-messages">
          {messages.map((m) => (
            <div key={m.id} className={`chat-message ${m.kind || ''}`}>
              <strong>{m.author}</strong>
              <div>{m.text}</div>
            </div>
          ))}
          <div ref={endRef}></div>
        </div>

        <div className="chat-send-row">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ваше сообщение" />
          <button className="btn" onClick={handleSend}>Отправить</button>
        </div>
      </div>
    </div>
  )
}
