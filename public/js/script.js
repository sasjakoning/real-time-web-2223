import playerMovement from "./playerMovement.js";
import userSignIn from "./userSignIn.js";

// load socket.io
let socket = io();

// // get currently online users
// socket.emit("getOnlineUsers");

// get DOM for lobby, player container and user list
const lobby = document.querySelector(".lobby");
const playerContainer = document.querySelector(".container");
const userList = document.querySelector(".userList");

// open user register dialog
const registerDialog = document.querySelector("dialog");
registerDialog.showModal();


// check if user is on lobby page
if (lobby) {

    let playerId;

    // handle new user sign in
    userSignIn.userSignIn(socket, registerDialog);

    // handle currently online users by adding to user list
    socket.on("onlineUsers", (onlineUsers) => {
        console.log("currently online users: ", onlineUsers);
        for (let id in onlineUsers) {

            console.log("id: ", id, "playerId: ", socket.id)
            
            addPlayer(id, onlineUsers[id].x, onlineUsers[id].y);
            // turn onlineUsers into an array
            const onlineUsersArray = Object.entries(onlineUsers);

            updateUserlist(onlineUsersArray);

            playerMovement.updateUserPosition(onlineUsersArray);

        }
    });


    // handle new user
    socket.on("userConnected", (onlineUsers, id) => {
        for (let id in onlineUsers) {
            console.log("ADDING PLAYER ON USERCONNECTED")
            addPlayer(id, onlineUsers[id].x, onlineUsers[id].y);


            // turn onlineUsers into an array
            const onlineUsersArray = Object.entries(onlineUsers);

            updateUserlist(onlineUsersArray);
        }
    });


    socket.on("playerId", (id) => {
        console.log("setting player id: ", id);
        playerId = id;
    });

    // check if dialog is closed before adding event listener
    registerDialog.addEventListener("close", () => {

        document.addEventListener("keydown", (e) => {
            // handle keydown event
            playerMovement.handleKeyDown(e, playerId, socket);
        });

    });



    // update external player position
    socket.on("updatePlayer", (data) => {
        const player = document.getElementById(data.id);

        if(player) {
            playerMovement.updateExternalPlayerPosition(player, data);
        } else {
            addPlayer(data.id, data.x, data.y);
        }
    });


    // handle user disconnect by removing from user list
    socket.on("userDisconnected", (onlineUsers, id) => {


        if (!Object.keys(onlineUsers).length === 0) {
            updateUserlist(onlineUsers);
        }

        // remove player for container based on id
        const player = document.getElementById(id);
        if(player){
            playerContainer.removeChild(player);
        }
    });

    
}

function addPlayer(id, x, y) {
    const playerExists = document.getElementById(id);

    if(!playerExists){
        const player = document.createElement("div");
    
        player.id = id;
        player.classList.add("player");
    
        playerContainer.appendChild(player);
    }

};

function updateUserlist(onlineUsers) {

    // clear userList
    
    while (userList.firstChild) {
        userList.removeChild(userList.firstChild);
    }

    onlineUsers.forEach(user => {
        const newUser = document.createElement("li");
        const newUserTitle = document.createElement("p");
        newUserTitle.textContent = user[1].username;
        newUser.appendChild(newUserTitle);
        userList.appendChild(
            // create a new li element
            Object.assign(newUser)
        );
    });

}



// const apiKey = "";
// const stationCode = "EKZ"; // replace with your desired station code

// fetch(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${stationCode}`, {
//   headers: {
//     "Ocp-Apim-Subscription-Key": apiKey
//   }
// })
// .then(response => response.json())
// .then(data => {
//   console.log(data);
// })
// .catch(error => {
//   console.error(error);
// });