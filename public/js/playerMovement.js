function playerMovement() {

    const container = document.querySelector('.container');
    const player = document.querySelector('.player');
    console.log(player);
    
    // get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // get player dimensions
    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;
    
    // store the current movement direction
    let movement = { x: 0, y: 0 };
    
    // update the player's position based on the current movement direction
    function updatePlayerPosition() {
        const leftPercentage = parseFloat(window.getComputedStyle(player).getPropertyValue('left')) / containerWidth * 100;
        const topPercentage = parseFloat(window.getComputedStyle(player).getPropertyValue('top')) / containerHeight * 100;
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
        
        player.style.left = `${clampedLeftPercentage}%`;
        player.style.top = `${clampedTopPercentage}%`;
        
        requestAnimationFrame(updatePlayerPosition);
    }
    
    // handle keyboard input
    function handleKeyDown(e) {
        switch (e.key) {
            case 'w':
                movement.y = -1;
                break;
            case 'a':
                movement.x = -1;
                break;
            case 's':
                movement.y = 1;
                break;
            case 'd':
                movement.x = 1;
                break;
        }
    }
    
    function handleKeyUp(e) {
        switch (e.key) {
            case 'w':
                movement.y = 0;
                break;
            case 'a':
                movement.x = 0;
                break;
            case 's':
                movement.y = 0;
                break;
            case 'd':
                movement.x = 0;
                break;
        }
    }
    
    // start the update loop
    requestAnimationFrame(updatePlayerPosition);
    
    // add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

}

export default { playerMovement }