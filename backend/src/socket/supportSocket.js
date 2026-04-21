const roomUsers = new Map()

export function registerSupportSocket(io) {
  io.on('connection', (socket) => {
    socket.on('support:join', (payload) => {
      const room = payload?.room || 'public-support'
      const nickname = payload?.nickname || 'guest'
      const role = payload?.role || 'user'

      socket.join(room)
      roomUsers.set(socket.id, { room, nickname, role })

      io.to(room).emit('support:message', {
        id: Date.now() + Math.random(),
        author: 'Система',
        text: `${nickname} подключился в комнату ${room}`,
        kind: 'system',
      })
    })

    socket.on('support:message', (text) => {
      const current = roomUsers.get(socket.id)
      if (!current || !text?.trim()) return

      io.to(current.room).emit('support:message', {
        id: Date.now() + Math.random(),
        author: current.nickname,
        text,
        kind: current.role === 'admin' ? 'admin' : 'user',
      })
    })

    socket.on('disconnect', () => {
      const current = roomUsers.get(socket.id)
      if (current) {
        io.to(current.room).emit('support:message', {
          id: Date.now() + Math.random(),
          author: 'Система',
          text: `${current.nickname} вышел из чата`,
          kind: 'system',
        })
      }

      roomUsers.delete(socket.id)
    })
  })
}
