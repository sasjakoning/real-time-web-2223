

// handle keyboard input
function handleKeyDown(e, socket, movement) {
    switch (e.key) {
        case 'w':
            movement.y = -1;
            socket.emit("pressDownForward", { movement });
            break;
        case 'a':
            movement.x = -1;
            socket.emit("pressDownRight", { movement });
            break;
        case 's':
            movement.y = 1;
            socket.emit("pressDownBackward", { movement });
            break;
        case 'd':
            movement.x = 1;
            socket.emit("pressDownLeft", { movement });
            break;
    }
}

function handleKeyUp(e, socket, movement) {
    switch (e.key) {
        case 'w':
            movement.y = 0;
            socket.emit("pressUpForward", { movement });
            break;
        case 'a':
            movement.x = 0;
            socket.emit("pressUpRight", { movement });
            break;
        case 's':
            movement.y = 0;
            socket.emit("pressUpBackward", { movement });
            break;
        case 'd':
            movement.x = 0;
            socket.emit("pressUpLeft", { movement });
            break;
    }
}


// let playerId;
// let currentPlayer;

// // handle movement events send by server
// const movementEvents = [
//     "moveForward",
//     "moveRight",
//     "moveBackward",
//     "moveLeft",
//     "stopForward",
//     "stopRight",
//     "stopBackward",
//     "stopLeft",
// ];

// function triggerMovement(socket, movement) {
    
//     movementEvents.forEach((eventName) => {
//         socket.on(eventName, (data, id) => {
//             console.log(data)
//             movement = data.playerMovement;
//             playerId = id;
    
//             if(playerId === socket.id){
//                 console.log("movement by current user")
//                 currentPlayer = document.querySelector(`[data-player-id="${playerId}"]`)
//             }else {
//                 console.log("movement by external user")
//             }
//         });
//     });

// }


function playerMovement(socket, movement) {

    const container = document.querySelector('.container');


    // get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    
    // get player dimensions
    const playerWidth = currentPlayer.offsetWidth;
    const playerHeight = currentPlayer.offsetHeight;
    
    
    // update the player's position based on the current movement direction
    function updatePlayerPosition() {
        const leftPercentage = parseFloat(window.getComputedStyle(currentPlayer).getPropertyValue('left')) / containerWidth * 100;
        const topPercentage = parseFloat(window.getComputedStyle(currentPlayer).getPropertyValue('top')) / containerHeight * 100;
        const newLeftPercentage = Math.round((leftPercentage + movement.x / 2) * 100) / 100;
        const newTopPercentage = Math.round((topPercentage + movement.y / 2) * 100) / 100;
        
        // compute the minimum and maximum valid values for the player's position
        const minLeftPercentage = 0;
        const maxLeftPercentage = 100 - playerWidth / containerWidth * 100;
        const minTopPercentage = 0;
        const maxTopPercentage = 100 - playerHeight / containerHeight * 100;
        
        // clamp the computed position values to the valid limits
        const clampedLeftPercentage = Math.min(Math.max(newLeftPercentage, minLeftPercentage), maxLeftPercentage);
        const clampedTopPercentage = Math.min(Math.max(newTopPercentage, minTopPercentage), maxTopPercentage);
        
        
        currentPlayer.style.left = `${clampedLeftPercentage}%`;
        currentPlayer.style.top = `${clampedTopPercentage}%`;
        
        requestAnimationFrame(updatePlayerPosition);
    }
    
    
    // start the update loop
    requestAnimationFrame(updatePlayerPosition);
    

}

export default { 
    playerMovement,
    handleKeyDown,
    handleKeyUp
}