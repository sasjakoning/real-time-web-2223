function movePlayer(x, y, id, socket, leftWalk, rightWalk, frontWalk, backWalk) {
    const player = document.getElementById(id);
    const playerRect = player.getBoundingClientRect();
  
    const diffX = Math.abs(playerRect.x - x);
    const diffY = Math.abs(playerRect.y - y);
  
    if (diffX > diffY) {
        player.style.left = `${x}px`;
        // handle animation direction based on x position of player
        handleAnimationDirection(x > diffX ? "right" : "left");

        setTimeout(() => {
            player.style.top = `${y}px`;
            // Add the event listener after the second transition
            handleAnimationDirection(y > diffY ? "front" : "back");

            setTimeout(() => {
                handleAnimationEnd();
            }, 500);
        }, 500);

    } else {
        player.style.top = `${y}px`;
        // handle animation direction based on y position of player
        handleAnimationDirection(y > diffY ? "front" : "back");

        setTimeout(() => {
            player.style.left = `${x}px`;
            // Add the event listener after the second transition
            handleAnimationDirection(x > diffX ? "right" : "left");

            setTimeout(() => {
                handleAnimationEnd();
            }, 500);
        }, 500);

    }

    if (id == socket.id) {
      socket.emit("playerMove", { x, y, leftWalk, rightWalk, frontWalk, backWalk });
    }
  
    function handleAnimationEnd() {
      console.log("animation ended");
  
      backWalk.value = false;
      frontWalk.value = false;
      rightWalk.value = false;
      leftWalk.value = false;
    }
  
    function handleAnimationDirection(direction) {
      switch (direction) {
        case "left":
          backWalk.value = false;
          frontWalk.value = false;
          rightWalk.value = false;
          leftWalk.value = true;
          break;
        case "right":
          backWalk.value = false;
          frontWalk.value = false;
          leftWalk.value = false;
          rightWalk.value = true;
          break;
        case "front":
          backWalk.value = false;
          rightWalk.value = false;
          leftWalk.value = false;
          frontWalk.value = true;
          break;
        case "back":
          frontWalk.value = false;
          rightWalk.value = false;
          leftWalk.value = false;
          backWalk.value = true;
          break;
        default:
          break;
      }
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