import api from '../helpers/api.js';

export default (io, socket, onlineUsers) => {
    // 1. HANDLE USER CONNECTION

    console.log('a user connected to lobby');

    // 2. SEND CURRENTLY ONLINE USERS TO CLIENT
    io.emit('updateOnlineUsers', onlineUsers);

    socket.on("getApiData", async () => {
        const data = await api.getApi();
        socket.emit("onGetApiData", data)
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
        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) {
            currentUser.x = data.x;
            currentUser.y = data.y;
        }

        io.emit("onPlayerMove", { id: socket.id, x: data.x, y: data.y});
    })

    socket.on("setPlayerAnims" , (data) => {

        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) { 
            currentUser.anims = data.anims;
        }
        
        io.emit('updateOnlineUsers', onlineUsers);
    });

    socket.on("setRiveStateMachine" , (data) => {
        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) {
            currentUser.stateMachine = data.stateMachine;
        }
        
        io.emit('updateOnlineUsers', onlineUsers);
    });

    
    // ?. HANDLE USER DISCONNECT
    socket.on('disconnect', () => {
        console.log('a user disconnected from lobby');

        // remove user from onlineUsers

        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) {
            onlineUsers.splice(onlineUsers.indexOf(currentUser), 1);
            io.emit('updateOnlineUsers', onlineUsers);
            io.emit('userDisconnected', socket.id);
        }
    });

    function matchIDs(onlineUsers, socket) {
        for (let user of onlineUsers) {
            if (user.id === socket.id) {
                return user;
            }
        }
        return null; // Return null if no match is found
    }


}
