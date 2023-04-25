
function movePlayer(x, y, id, socket) {
    const player = document.getElementById(id);
    console.log("player", player)
    const playerRect = player.getBoundingClientRect();

    const diffX = Math.abs(playerRect.x - x);
    const diffY = Math.abs(playerRect.y - y);

    if(id == socket.id) {
        socket.emit("playerMove", { x, y });
    }

    if (diffX > diffY) { 
        player.style.left = `${x}px`;
        setTimeout(() => {
            player.style.top = `${y}px`;
        }, 500);
    } else {
        player.style.top = `${y}px`;
        setTimeout(() => {
            player.style.left = `${x}px`;
        }, 500);
    }
}

function updateUserPosition(onlineUsers){
    
    onlineUsers.forEach(user => {
        console.log(user)
        const player = document.getElementById(user[0]);

        if(player) {
            player.style.left = `${user[1].x}px`;
            player.style.top = `${user[1].y}px`;
        }
    });

}

export default { 
    movePlayer,
    updateUserPosition
}