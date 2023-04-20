
export default (io, socket, onlineUsers) => {

    // get currently online users and send to client
    socket.on("getOnlineUsers", () => {
        console.log(onlineUsers)
        socket.emit("onlineUsers", onlineUsers);
    })

    // set username for new user in onlineUsers variable and socket. send to client.
    socket.on("newUser", (username) => {
        console.log("setUsername: " + username);

        // save username to socket
        onlineUsers[username] = socket.id;
        console.log(onlineUsers)
        socket["username"] = username;

        io.emit("newUser", username, socket.id);
    });

    // handle movement events triggered by keydown and keyup client events
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
            // fire movement event on client side
            io.emit(movementEvent.name, playerMovement, socket.id);
        });

        socket.on(movementEvent.pressUp, (data) => {
            console.log(`stop ${movementEvent.name}`);
            const playerMovement = data.movement;
            // fire movement event on client side
            io.emit(`stop${movementEvent.direction}`, playerMovement, socket.id);
        });
    });


    // handle disconnect event, remove user from onlineUsers and send to client.
    socket.on('disconnect', () => {
        delete onlineUsers[socket.username];
        io.emit("userDisconnected", onlineUsers)
        console.log(`User disconnected: ${socket.username}`);
    })
}