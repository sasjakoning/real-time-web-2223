
export default (io, socket, onlineUsers) => {

    console.log("online users:", onlineUsers)

    socket.on("getOnlineUsers", () => {
        console.log(onlineUsers)
        socket.emit("onlineUsers", onlineUsers);
    })

    socket.on("newUser", (username) => {
        console.log("setUsername: " + username);

        // save username to socket
        onlineUsers[username] = socket.id;
        console.log(onlineUsers)
        socket["username"] = username;

        // socket.username = username;
        io.emit("newUser", username, socket.id);
    });

    const movementEvents = [
        { name: "moveForward", direction: "Forward", pressDown: "pressDownForward", pressUp: "pressUpForward" },
        { name: "moveRight", direction: "Right", pressDown: "pressDownRight", pressUp: "pressUpRight" },
        { name: "moveBackward", direction: "Backward", pressDown: "pressDownBackward", pressUp: "pressUpBackward" },
        { name: "moveLeft", direction: "Left", pressDown: "pressDownLeft", pressUp: "pressUpLeft" },
    ];

    movementEvents.forEach((movementEvent) => {
        socket.on(movementEvent.pressDown, (data) => {
            console.log(`moving ${movementEvent.name}`);
            const playerMovement = data.movement;
            io.emit(movementEvent.name, playerMovement, socket.id);
        });

        socket.on(movementEvent.pressUp, (data) => {
            console.log(`stop ${movementEvent.name}`);
            const playerMovement = data.movement;
            io.emit(`stop${movementEvent.direction}`, playerMovement, socket.id);
        });
    });


    socket.on('disconnect', () => {
        delete onlineUsers[socket.username];
        io.emit("userDisconnected", onlineUsers)
        console.log(`User disconnected: ${socket.username}`);
    })
}