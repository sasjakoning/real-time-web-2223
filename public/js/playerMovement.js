const container = document.querySelector('.container');
const containerWidth = container.offsetWidth;
const containerHeight = container.offsetHeight;
let frontWalk;
let backWalk;
let leftWalk;
let rightWalk;

function movePlayer(x, y, animationInputs, id, socket) {
  // Get player element matching id
  const player = document.getElementById(id);
  // Round clicked position values to avoid decimal bugs
  const roundedX = Math.round(x);
  const roundedY = Math.round(y);
  // Get current position of player relative to the container
  const playerX = player.offsetLeft;
  const playerY = player.offsetTop;
  // Get difference between clicked position and current position
  const diffX = Math.abs(playerX - roundedX);
  const diffY = Math.abs(playerY - roundedY);

  // Check if the current player is moving or if it's and external player
  if(id === socket.id) {
    // Convert x and y to cqw units
    console.log(x, y)
    x = (x/containerWidth)*100 + "cqw";
    y = (y/containerHeight)*100 + "cqh";

    console.log(x, y)
    socket.emit("playerMove", {x: x, y: y, id: id})
  }

  // Get animation inputs object matching id
  const animInputs = animationInputs.find((i) => i.id === id);
  // Set animation inputs
  frontWalk = animInputs.front;
  backWalk = animInputs.back;
  leftWalk = animInputs.left;
  rightWalk = animInputs.right;

  // Calculate which direction to move the player based on which difference in distance is greater
  if (diffX > diffY) {
    // Move player
    player.style.left = `${x}`;
    // Trigger animation based on direction
    handleAnimationDirection(roundedX > playerX ? "right" : "left");
    // Wait for transition to end and fire next animation and movement.
    setTimeout(() => {
      handleAnimationDirection(roundedY > playerY ? "front" : "back");
      player.style.top = `${y}`;
      // Wait for transition end and reset animations
      setTimeout(() => {
        handleAnimationEnd();
      }, 500);
    }, 500);
  } else {
    player.style.top = `${y}`;
    handleAnimationDirection(roundedY > playerY ? "front" : "back");
    setTimeout(() => {
      player.style.left = `${x}`;
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
        console.log("updating user position", player)
      player.style.left = user.x;
      player.style.top = user.y;
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

export default { movePlayer, updateUserPosition }
