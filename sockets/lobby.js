import api from '../helpers/api.js';

export default (io, socket, onlineUsers) => {
    // HANDLE USER CONNECTION

    console.log('a user connected to lobby');

    // SEND CURRENTLY ONLINE USERS TO CLIENT
    io.emit('updateOnlineUsers', onlineUsers);

    // HANDLE API REQUEST
    socket.on("getApiData", async () => {
        const data = await api.getApi();
        socket.emit("onGetApiData", data)
    });

    // HANDLE NEW USER SIGN IN
    socket.on('newUser', (username) => {
        const user = {
            username: username,
            id: socket.id,
            x: 0,
            y: 0,
            skin: 0
        };

        onlineUsers.push(user);

        io.emit('updateOnlineUsers', onlineUsers);
    });

    // HANDLE USER CHAT
    socket.on("sendChat", (data) => {
        const userId = data.id;
        let username;
        // match user id to username
        onlineUsers.forEach(onlineUser => {
            if (onlineUser.id === userId) {
                username = onlineUser.username;
            }
        });
        const message = data.message;

        io.emit("onSendChat", { userId, username, message });

    });        

    // HANDLE USER MOVEMENT
    socket.on("playerMove", (data) => {
        // Get player from onlineUsers matching the ID and update X and Y coordinates

        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) {
            currentUser.x = data.x;
            currentUser.y = data.y;
        }

        // EMIT PLAYER MOVEMENT TO ALL CLIENTS
        io.emit("onPlayerMove", { id: socket.id, x: data.x, y: data.y});
    })

    // HANDLE SKIN CHANGE
    socket.on("skinChange", (data) => {
        // Get player from onlineUsers matching the ID and update skin

        const currentUser = matchIDs(onlineUsers, socket);
        if (currentUser) {
            currentUser.skin = data.skin;
        }
        io.emit("onSkinChange", { id: socket.id, skin: data.skin})
    })
    
    // HANDLE USER DISCONNECT
    socket.on('disconnect', () => {
        console.log('a user disconnected from lobby');

        // Remove user from onlineUsers
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
