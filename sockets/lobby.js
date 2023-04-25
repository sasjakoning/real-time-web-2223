export default (io, socket, onlineUsers) => {

    console.log("currently online users: ", onlineUsers);

    io.emit("onlineUsers", onlineUsers);

    socket.emit("playerId", socket.id);

    socket.on("newUser", (username) => {

        onlineUsers[socket.id] = {
            x: 0,
            y: 0,
            username: username
        };

        io.emit("userConnected", onlineUsers, socket.id);

        console.log(`User connected: ${socket.id}`);
    });

    socket.on("playerMove", (data) => {
        // const player = onlineUsers[socket.id];

        onlineUsers[socket.id].x = data.x;
        onlineUsers[socket.id].y = data.y;

        io.emit("updatePlayerMovement", { id: socket.id, x: data.x, y: data.y });
    })

    // handle disconnect event, remove user from onlineUsers and send to client.
    socket.on('disconnect', (reason) => {
        console.log("reason: ", reason);
        const id = socket.id;
        delete onlineUsers[socket.id];
        io.emit("userDisconnected", onlineUsers,id);
        console.log(`User disconnected: ${socket.id}`);
    })
}