function movePlayer(x, y, id, socket) {
    const player = document.getElementById(id);
    const playerRect = player.getBoundingClientRect();
  
    const diffX = Math.abs(playerRect.x - x);
    const diffY = Math.abs(playerRect.y - y);
  
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

    // emit player movement to server only if id matches socket id
    if (id === socket.id) {
        socket.emit("playerMove", {x: x, y: y, id: id})
    }
}
  

function updateUserPosition(onlineUsers){

    console.log("updating user position")
    
    
    onlineUsers.forEach(user => {
        console.log(user.id)
        const player = document.getElementById(user.id);

        console.log(player)

        if(player) {
            player.style.left = `${user.x}px`;
            player.style.top = `${user.y}px`;
        }
    });

}

export default { 
    movePlayer,
    updateUserPosition
}