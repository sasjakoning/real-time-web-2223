import userSignIn from './userSignIn.js';
import rive from './rive.js';
import playerMovement from './playerMovement.js';

let socket = io();

let onlineUsers = [];
let animationInputs = [];
const playerContainer = document.querySelector(".container");

// Get API data on load
getApiData();
// Then get API data every minute
setInterval(getApiData, 60 * 1000);


/* ------------------------------------------------------ */
/*               USER CONNECTION MANAGEMENT               */
/* ------------------------------------------------------ */

const offlineMessage = document.querySelector(".offline");

if (!socket.connected) {
    showOfflineMessage();
}

// HIDE OFFLINE MESSAGE
socket.on('connect', () => {
    hideOfflineMessage();
});

// SHOW OFFLINE MESSAGE
socket.on('disconnect', () => {
    showOfflineMessage();
});


/* ------------------------------------------------------ */
/*                 API AND USER MANAGEMENT                */
/* ------------------------------------------------------ */

// HANDLE API DATA
socket.on("onGetApiData", (data) => {
    handleApiData(data);
})

// UPDATE ONLINE USERS
socket.on('updateOnlineUsers', (users) => {
    onlineUsers = users;
    updateOnlineUsers();
    playerMovement.updateUserPosition(onlineUsers);

    // add players to container
    onlineUsers.forEach(user => {
        addPlayer(user.id, user.username);
    });
});


/* ------------------------------------------------------ */
/*            USER SIGN IN AND PLAYER MOVEMENT            */
/* ------------------------------------------------------ */

// HANDLE NEW USER SIGN IN
const registerDialog = document.querySelector("dialog");
registerDialog.showModal();
registerDialog.addEventListener("close", handlePlayerMovement())

const usernameForm = document.querySelector("#usernameForm");
usernameForm.addEventListener("submit", (e) => {
    userSignIn.userSignIn(socket, registerDialog, e);
});;

// UPDATE PLAYER POSITION
socket.on("onPlayerMove", (data) => {
    const player = document.getElementById(data.id);

    if (player && data.id !== socket.id) {
        console.log("updating external player position", data);
        playerMovement.movePlayer(data.x, data.y, animationInputs, data.id, socket);
    }
})


/* ------------------------------------------------------ */
/*             HANDLE EXTERNAL USER DISCONNECT            */
/* ------------------------------------------------------ */

socket.on("userDisconnected", (id) => {
    console.log("user disconnected", id);
    const player = document.getElementById(id);

    if (player) {
        player.remove();
    }
})


/* ------------------------------------------------------ */
/*                    GENERAL FUNCTIONS                   */
/* ------------------------------------------------------ */

function updateOnlineUsers() {
    let onlineUsersList = document.querySelector('.userList');
    onlineUsersList.innerHTML = '';

    for (let i = 0; i < onlineUsers.length; i++) {
        const user = onlineUsers[i];
        let li = document.createElement('li');
        li.innerHTML = user.username;
        onlineUsersList.appendChild(li);
    }

};

function addPlayer(id, username) {
    const playerExists = document.getElementById(id);

    if (!playerExists) {
        console.log("adding new player to container");

        // Create div with canvas
        const player = document.createElement('div');
        const playerCanvas = document.createElement('canvas');
        playerCanvas.classList.add("playerCanvas");
        player.appendChild(playerCanvas);

        rive.character(playerCanvas, id);

        // Add id to div
        player.id = id;
        player.classList.add('player');

        // Add username to div
        const playerName = document.createElement('p');
        playerName.textContent = username;
        player.appendChild(playerName);

        playerContainer.appendChild(player);
    } else {
        console.log("player already exists");
    }
}

function handlePlayerMovement() {
    playerContainer.addEventListener('click', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;

        playerMovement.movePlayer(x, y, animationInputs, socket.id, socket);
    });
}

function initAnims(front, back, left, right, id) {
    // Pushes rive inputs to array as object
    const userInput = {
        id: id,
        front: front,
        back: back,
        left: left,
        right: right
    }

    animationInputs.push(userInput);
}

function getApiData() {
    console.log("getting API data");
    socket.emit("getApiData");
}

function handleApiData(data) {
    // create a countdown based on the four digit time string compared to the current time
    const timeString = data.actualDateTime;
    const time = new Date(timeString);
    const timeNow = new Date();
    const timeDiff = time - timeNow;
    const timeDiffMinutes = Math.floor(timeDiff / 1000 / 60);

    // convert time to four digit string
    const timeShortened = time.toLocaleTimeString([],
        { hour: '2-digit', minute: '2-digit' });

    const infoBoard = document.querySelector(".infoContainer--info");

    infoBoard.innerHTML = "";
    const directionText = document.createElement("p");
    directionText.textContent = data.direction;
    const timeWrapper = document.createElement("div");
    const departureText = document.createElement("p");
    departureText.textContent = timeShortened;
    const countdown = document.createElement("p");
    countdown.textContent = timeDiffMinutes + " minuten";

    timeWrapper.appendChild(departureText);
    timeWrapper.appendChild(countdown);


    infoBoard.appendChild(timeWrapper);
    infoBoard.appendChild(directionText);
}

function showOfflineMessage() {
    if (offlineMessage.classList.contains("hidden")) {
        offlineMessage.classList.remove("hidden");
    }
}

function hideOfflineMessage() {
    if (!offlineMessage.classList.contains("hidden")) {
        offlineMessage.classList.add("hidden");
    }
}

export default {
    initAnims
}