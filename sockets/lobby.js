export default (io, socket, onlineUsers) => {
    // 1. HANDLE USER CONNECTION

    console.log('a user connected to lobby');

    // 2. SEND CURRENTLY ONLINE USERS TO CLIENT
    io.emit('updateOnlineUsers', onlineUsers);

    // 3. HANDLE NEW USER SIGN IN
    socket.on('newUser', (username) => {
        const user = {
            username: username,
            id: socket.id,
            x: 0,
            y: 0,
        };

        onlineUsers.push(user);

        io.emit('updateOnlineUsers', onlineUsers);
    });

    socket.on("playerMove", (data) => {
        // const player = onlineUsers[socket.id];

        console.log(data)

        // get player from onlineUsers matching the ID
        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            if (user.id === socket.id) {
                user.x = data.x;
                user.y = data.y;
            }
        };

        // onlineUsers[socket.id].x = data.x;
        // onlineUsers[socket.id].y = data.y;

        io.emit("updatePlayerMovement", { id: socket.id, x: data.x, y: data.y});
    })

    socket.on("setPlayerAnims" , (data) => {
        // add player anims to player in onlineUsers matching the ID
        // console.log(data);
        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            if (user.id === socket.id) {
                user.anims = data.anims;
            }
        }
        
        io.emit('updateOnlineUsers', onlineUsers);
    });

    socket.on("setRiveStateMachine" , (data) => {
        // console.log(data.stateMachine);
        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            if (user.id === socket.id) {
                user.stateMachine = data.stateMachine;
            }
        }
        io.emit('updateOnlineUsers', onlineUsers);
    });

    
    // ?. HANDLE USER DISCONNECT
    socket.on('disconnect', () => {
        console.log('a user disconnected from lobby');
        for (let user in onlineUsers) {
            if (onlineUsers[user] === socket.id) {
                delete onlineUsers[user];
                io.emit('updateOnlineUsers', onlineUsers);
            }
        }
    });

}
