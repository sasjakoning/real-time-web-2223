function handleKeyDown(e, playerId, socket) {
    if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d" || e.target.parentNode.classList == "playerControls") {
        const player = document.getElementById(playerId);
        // get size of player

        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;

        const container = document.querySelector(".container");

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        if(e.target.parentNode.classList == "playerControls") {
            const controlClass = e.target.classList.value
            
            socket.emit("keydown", { key: controlClass, playerWidth, playerHeight, containerWidth, containerHeight });
        }else {
            socket.emit("keydown", { key: e.key, playerWidth, playerHeight, containerWidth, containerHeight });
        }

    }
}

function updateExternalPlayerPosition(player, data) {
    player.style.left = `${data.x}%`;
    player.style.top = `${data.y}%`;
}

function updateUserPosition(onlineUsers){
    
    onlineUsers.forEach(user => {
        const player = document.getElementById(user[0]);

        if(player) {
            player.style.left = `${user[1].x}%`;
            player.style.top = `${user[1].y}%`;
        }
    });

}

export default { 
    handleKeyDown,
    updateExternalPlayerPosition,
    updateUserPosition
}