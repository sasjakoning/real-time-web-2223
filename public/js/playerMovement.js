const container = document.querySelector('.container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;
const containerRect = container.getBoundingClientRect();

let frontWalk;
let backWalk;
let leftWalk;
let rightWalk;


function movePlayer(x, y, animationInputs, id, socket) {
    // get player element matching id
    const player = document.getElementById(id);

    // Round clicked position values to avoid decimal bugs
    const roundedX = Math.round(x);
    const roundedY = Math.round(y);

    // get current position of player relative to the container
    const playerX = player.offsetLeft;
    const playerY = player.offsetTop;

    // get difference between clicked position and current position
    const diffX = Math.abs(playerX - roundedX);
    const diffY = Math.abs(playerY - roundedY);

    // check if the current player is moving or if it's and external player
    if(id === socket.id) {
        // convert x and y to percentages
        x = (x/containerWidth)*100;
        y = (y/containerHeight)*100;

        socket.emit("playerMove", {x: x, y: y, id: id})
    }

    // get animation inputs object matching id
    const animInputs = animationInputs.find((i) => i.id === id);
    // set animation inputs
    frontWalk = animInputs.front;
    backWalk = animInputs.back;
    leftWalk = animInputs.left;
    rightWalk = animInputs.right;
    

    // Calculate which direction to move the player based on which difference in distance is greater
    if (diffX > diffY) {
        // move player
        player.style.left = `${x}%`;

        // trigger animation based on direction
        handleAnimationDirection(roundedX > playerX ? "right" : "left");

        // wait for transition to end and fire next animation and movement.
        setTimeout(() => {
            handleAnimationDirection(roundedY > playerY ? "front" : "back");

            player.style.top = `${y}%`;

            // wait for transition end and reset animations
            setTimeout(() => {
                handleAnimationEnd();
            }, 500);
        }, 500);
    } else {
        player.style.top = `${y}%`;
        
        handleAnimationDirection(roundedY > playerY ? "front" : "back");

        setTimeout(() => {
            player.style.left = `${x}%`;

            handleAnimationDirection(roundedX < playerX ? "right" : "left");

            setTimeout(() => {
                handleAnimationEnd();
            }, 500);
        }, 500);
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

function handleAnimationEnd() {
    console.log("animation ended");

    backWalk.value = false;
    frontWalk.value = false;
    rightWalk.value = false;
    leftWalk.value = false;
  }

export default { 
    movePlayer,
    updateUserPosition
}