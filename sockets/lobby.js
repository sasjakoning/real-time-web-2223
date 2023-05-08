import api from '../helpers/api.js';

export default (io, socket, onlineUsers) => {
    // 1. HANDLE USER CONNECTION

    console.log('a user connected to lobby');

    // 2. SEND CURRENTLY ONLINE USERS TO CLIENT
    io.emit('updateOnlineUsers', onlineUsers);

    socket.on("getApiData", async () => {
        const data = await api.getApi();
        socket.emit("apiData", data)
    })

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
        // get player from onlineUsers matching the ID and update X and Y coordinates
        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            if (user.id === socket.id) {
                user.x = data.x;
                user.y = data.y;
            }
        };

        io.emit("updatePlayerMovement", { id: socket.id, x: data.x, y: data.y});
    })

    socket.on("setPlayerAnims" , (data) => {
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

        // remove user from onlineUsers

        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            if (user.id === socket.id) {
                onlineUsers.splice(i, 1);
                io.emit('updateOnlineUsers', onlineUsers);
                io.emit('userDisconnected', socket.id)
            }
        }
    });

}
