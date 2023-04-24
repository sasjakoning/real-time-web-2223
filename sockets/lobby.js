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

    socket.on("keydown", (data) => {
        const player = onlineUsers[socket.id];

        // calculate player width and height in percentage
        const playerWidthPercentage = (data.playerWidth / data.containerWidth) * 100;
        const playerHeightPercentage = (data.playerHeight / data.containerHeight) * 100;

        switch(data.key) {
            case "w":
            case "playerControls--up":
                player.y -= 1;
                if(player.y < 0){
                    player.y = 0;
                }
                break;
            case "a":
            case "playerControls--left":
                player.x -= 1;
                if(player.x < 0){
                    player.x = 0;
                }
                break;
            case "s":
            case "playerControls--down":
                player.y += 1;
                if(player.y > (100 - playerHeightPercentage)){
                    player.y = (100 - playerHeightPercentage);
                }
                break;
            case "d":
            case "playerControls--right":
                player.x += 1;
                if(player.x > (100 - playerWidthPercentage)){
                    player.x = (100 - playerWidthPercentage);
                }
                break;
            
        }

        console.log(data.key)

        

        io.emit("updatePlayer", { id: socket.id, x: player.x, y: player.y });
    })


    // handle disconnect event, remove user from onlineUsers and send to client.
    socket.on('disconnect', () => {
        const id = socket.id;
        delete onlineUsers[socket.id];
        io.emit("userDisconnected", onlineUsers,id);
        console.log(`User disconnected: ${socket.id}`);
    })
}