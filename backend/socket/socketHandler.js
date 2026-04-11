const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:' , socket.id)
      
        // User join room
        socket.on('join-room', (roomId) => {
            socket.join(roomId)
            console.log(`User ${socket.id} joined room ${roomId}`)

            const roomUsers = io.sockets.adapter.rooms.get(roomId)
            const userCount = roomUsers ? roomUsers.size: 1 

            //  Telling all users in room that new user joined
           io.to(roomId).emit('room-users', userCount)
        })

        //  Send everyone that user is typing
        socket.on('note-change', ({ roomId, content, title})  => {
            console.log('note-change received', roomId, content)
            socket.to(roomId).emit('note-change', { content, title })
        })
        // User typing indicator
        socket.on('user-typing', ({ roomId, userName}) => {
            socket.to(roomId).emit('user-typing', userName)
        })

        //  User is disconnect
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
        }) 
      
    })
}
module.exports = socketHandler