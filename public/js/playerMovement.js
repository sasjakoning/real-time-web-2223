const container = document.querySelector('.container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

function movePlayer(x, y, id, socket) {
    const player = document.getElementById(id);
    const playerRect = player.getBoundingClientRect();

    const diffX = Math.abs(playerRect.x - x);
    const diffY = Math.abs(playerRect.y - y);

    if (diffX > diffY) {
        player.style.left = `${(x/containerWidth)*100}%`;

        setTimeout(() => {
            player.style.top = `${(y/containerHeight)*100}%`;
        }, 500);
    } else {
        player.style.top = `${(y/containerHeight)*100}%`;

        setTimeout(() => {
            player.style.left = `${(x/containerWidth)*100}%`;
        }, 500);
    }

    // emit player movement to server only if id matches socket id
    if (id === socket.id) {
        socket.emit("playerMove", {x: x, y: y, id: id})
    }
}

function updateUserPosition(onlineUsers) {
    console.log("updating user position")

    onlineUsers.forEach(user => {
        const player = document.getElementById(user.id);

        if(player) {
            player.style.left = `${(user.x/containerWidth)*100}%`;
            player.style.top = `${(user.y/containerHeight)*100}%`;
        }
    });
}

export default { 
    movePlayer,
    updateUserPosition
}