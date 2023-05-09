const container = document.querySelector('.container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;

let frontWalk;
let backWalk;
let leftWalk;
let rightWalk;


function movePlayer(x, y, animationInputs, id, socket) {
    const player = document.getElementById(id);
    const playerRect = player.getBoundingClientRect();

    const diffX = Math.abs(playerRect.x - x);
    const diffY = Math.abs(playerRect.y - y);

    if(id === socket.id) {
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
    

    if (diffX > diffY) {
        player.style.left = `${x}%`;

        handleAnimationDirection(x > diffX ? "right" : "left");

        setTimeout(() => {
            handleAnimationDirection(y > diffY ? "front" : "back");

            player.style.top = `${y}%`;

            setTimeout(() => {
                handleAnimationEnd();
            }, 500);
        }, 500);
    } else {
        player.style.top = `${y}%`;
        
        handleAnimationDirection(y > diffY ? "front" : "back");

        setTimeout(() => {
            player.style.left = `${x}%`;

            handleAnimationDirection(x > diffX ? "right" : "left");

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