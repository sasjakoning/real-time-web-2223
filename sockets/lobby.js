export default (io, socket) => {

    let onlineUsers = {};

    console.log("currently online users: ", onlineUsers);

    io.emit("onlineUsers", onlineUsers);

    socket.emit("playerId", socket.id);

    socket.on("newUser", (username) => { 

        onlineUsers[socket.id] = {
            x: 0,
            y: 0,
            username: username
        };

        socket.emit("userConnected", onlineUsers, socket.id);

        console.log(`User connected: ${socket.id}`);
    });

    socket.on("keydown", (data) => {
        const player = onlineUsers[socket.id];
        console.log(onlineUsers)

        switch(data.key) {
            case "w":
                player.y -= 1;
                break;
            case "a":
                player.x -= 1;
                break;
            case "s":
                player.y += 1;
                break;
            case "d":
                player.x += 1;
                break;
        }

        io.emit("updatePlayer", { id: socket.id, x: player.x, y: player.y });
    })


    // handle disconnect event, remove user from onlineUsers and send to client.
    socket.on('disconnect', () => {
        delete onlineUsers[socket.id];
        io.emit("userDisconnected", onlineUsers);
        console.log(`User disconnected: ${socket.id}`);
    })
}