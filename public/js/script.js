import userSignIn from './userSignIn.js';
import rive from './rive.js';
import playerMovement from './playerMovement.js';

let socket = io();

let onlineUsers = [];

let frontWalk;
let backWalk;
let leftWalk;
let rightWalk;

// open user register dialog
const registerDialog = document.querySelector("dialog");
registerDialog.showModal();

// get player container
const playerContainer = document.querySelector(".container");

// check if lobby page is loaded
const lobby = document.querySelector('.lobby');

if(lobby) {

    function getApiData() {
        console.log("getting API data");
        socket.emit("getApiData");
    }

    // Get API data on load
    getApiData();
    // Then get API data every minute
    setInterval(getApiData, 60 * 1000);


    socket.on("apiData", (data) => {
        console.log(data)

        // create a countdown based on the four digit time string compared to the current time

        const timeString = data.actualDateTime;
        const time = new Date(timeString);
        const timeNow = new Date();
        const timeDiff = time - timeNow;
        const timeDiffMinutes = Math.floor(timeDiff / 1000 / 60);

        console.log(timeDiffMinutes)

        console.log(time)
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
    })

    // 1. UPDATE ONLINE USERS
    socket.on('updateOnlineUsers', (users) => {
        onlineUsers = users;
        updateOnlineUsers();
        playerMovement.updateUserPosition(onlineUsers);

        // add players to container
        for (let i = 0; i < onlineUsers.length; i++) {
            const user = onlineUsers[i];
            addPlayer(user.id, user.username);
        }
    });


    // 2. HANDLE NEW USER
    const usernameForm = document.querySelector("#usernameForm");
    usernameForm.addEventListener("submit", (e) => {
        userSignIn.userSignIn(socket, registerDialog, e);
    });

    registerDialog.addEventListener("close", handlePlayerMovement());

    // update player position
    socket.on("updatePlayerMovement", (data) => {
        const player = document.getElementById(data.id);

        if(player && data.id !== socket.id) {
            console.log("updating external player position", data);
            playerMovement.movePlayer(data.x, data.y, data.id, socket);
        }
    })
    
}

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

function addPlayer(id, username){
    const playerExists = document.getElementById(id);

    if(!playerExists){
        console.log("adding new player to container");

        // create div with canvas
        const player = document.createElement('div');
        const playerCanvas = document.createElement('canvas');
        playerCanvas.classList.add("playerCanvas");
        player.appendChild(playerCanvas);

        rive.character(playerCanvas);
        
        // add id to div
        player.id = id;
        player.classList.add('player');

        // add username to div
        const playerName = document.createElement('p');
        playerName.textContent = username;
        player.appendChild(playerName);

        playerContainer.appendChild(player);
    }else {
        console.log("player already exists");
    }
}

function handlePlayerMovement() {
    playerContainer.addEventListener('click', (e) => {
        const x = e.offsetX;
        const y = e.offsetY;

        console.log(onlineUsers[0].stateMachine[0].inputs[0])

        console.log(x, y);
        playerMovement.movePlayer(x, y, socket.id, socket);
    });
}

function initAnims(front, back, left, right) {
    frontWalk = front;
    backWalk = back;
    leftWalk = left;
    rightWalk = right;

    socket.emit("setPlayerAnims", {anims: {frontWalk, backWalk, leftWalk, rightWalk}, id: socket.id});
}

function sendRiveStateMachine(stateMachine) {
    socket.emit("setRiveStateMachine", {stateMachine: stateMachine, id: socket.id});
    console.log("sending stateMachine to server")
}

export default {
    initAnims,
    sendRiveStateMachine
}