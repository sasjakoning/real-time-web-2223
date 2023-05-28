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

  // Get current position of player relative to the container
  // convert playerX and playerY to containerWidth and containerHeight
  const playerX = (player.offsetLeft / containerWidth)*100;
  const playerY = (player.offsetTop / containerHeight)*100;

  // Get difference between clicked position and current position
  const diffX = Math.abs(playerX - x);
  const diffY = Math.abs(playerY - y);

  // Check if the current player is moving or if it's and external player
  if(id === socket.id) {
    socket.emit("playerMove", {x: x, y: y, id: id})
  }

  // Get animation inputs object matching id
  const animInputs = animationInputs.find((i) => i.id === id);
  // Set animation inputs
  frontWalk = animInputs.front;
  backWalk = animInputs.back;
  leftWalk = animInputs.left;
  rightWalk = animInputs.right;

  const distance = diffX + diffY;

  // Calculate the transition time based on a fixed speed factor
  const speedFactor = 10;

  const transitionTime = Math.round(distance * speedFactor);

  // Calculate the CSS transition duration based on the transition time
  const cssTransitionDuration = transitionTime / 1000 + "s";


  // Set CSS transition duration for the player
  player.style.transitionDuration = cssTransitionDuration;

  // Calculate which direction to move the player based on which difference in distance is greater
  if (diffX > diffY) {
    // Move player
    player.style.left = `${x}cqw`;
    // Trigger animation based on direction
    handleAnimationDirection(x > playerX ? "right" : "left");
    // Wait for transition to end and fire next animation and movement.
    setTimeout(() => {
      handleAnimationDirection(y > playerY ? "front" : "back");
      player.style.top = `${y}cqh`;
      // Wait for transition end and reset animations
      setTimeout(() => {
        handleAnimationEnd();
        player.style.transitionDuration = ""; // Reset CSS transition duration
      }, transitionTime);
    }, transitionTime);
  } else {
    player.style.top = `${y}cqh`;
    handleAnimationDirection(y > playerY ? "front" : "back");
    setTimeout(() => {
      player.style.left = `${x}cqw`;
      handleAnimationDirection(x < playerX ? "left" : "right");
      setTimeout(() => {
        handleAnimationEnd();
        player.style.transitionDuration = ""; // Reset CSS transition duration
      }, transitionTime);
    }, transitionTime);
  }
}

function updateUserPosition(onlineUsers) {
  onlineUsers.forEach(user => {
    const player = document.getElementById(user.id);
    if(player) {
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
  backWalk.value = false;
  frontWalk.value = false;
  rightWalk.value = false;
  leftWalk.value = false;
}

export default { movePlayer, updateUserPosition }
