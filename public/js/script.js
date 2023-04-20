
import movementHandler from "/js/playerMovement.js";


// load socket.io
let socket = io();

// get currently online users
socket.emit("getOnlineUsers");

// get DOM for lobby, player container and user list
const lobby = document.querySelector(".lobby");
const playerContainer = document.querySelector(".container");
const userList = document.querySelector(".userList");

// open user register dialog
const registerDialog = document.querySelector("dialog");
registerDialog.showModal();


// check if user is on lobby page
if (lobby){

    // handle currently online users by adding to user list
    socket.on("onlineUsers", (onlineUsers) => {
        console.log("online users:", onlineUsers)
        for(let username in onlineUsers){
            console.log("username: ", username)
            const newUser = document.createElement("li");

            const newUserTitle = document.createElement("p");
    
            newUserTitle.textContent = username;
    
            newUser.appendChild(newUserTitle);
    
            userList.appendChild(
                // create a new li element
                Object.assign(newUser)
            );
        }
    })


    // handle user disconnect by removing from userlist
    socket.on("userDisconnected", (onlineUsers) => {
    
        // fix this
        while (userList.firstChild) {
            userList.removeChild(userList.firstChild);
        }

        // repopulate the user list
        for(let username in onlineUsers){
            console.log("username: ", username)
            const newUser = document.createElement("li");

            const newUserTitle = document.createElement("p");
    
            newUserTitle.textContent = username;
    
            newUser.appendChild(newUserTitle);
    
            userList.appendChild(
                // create a new li element
                Object.assign(newUser)
            );
        }
    });
    
    // get user register form
    const usernameForm = document.querySelector("#usernameForm");
    
    /* ---------- set username ---------- */
    
    if(usernameForm) {
    
        usernameForm.addEventListener("submit", (e) => {
            e.preventDefault();
            console.log("submitting username")
            const usernameInput = document.querySelector("#usernameInput");
            const username = usernameInput.value;
            socket.emit("newUser", username);

            // close dialog
            registerDialog.close();
        });
    
        socket.on("newUser", (data, id) => {
    
            console.log("New user joined: ", data)
            console.log("With socket id: ", id)
    
            const newPlayerElement = document.createElement("div");
            newPlayerElement.classList.add("player");
            newPlayerElement.dataset.playerId = id;
    
            playerContainer.appendChild(newPlayerElement)
    
    
            const newUser = document.createElement("li");
    
            const newUserTitle = document.createElement("p");
    
            newUserTitle.textContent = data;
    
            newUser.appendChild(newUserTitle);
    
            userList.appendChild(
                // create a new li element
                Object.assign(newUser)
            );

            // // store the current movement direction
            // let movement = { x: 0, y: 0 };

            // // trigger player insertion and movement
            // movementHandler.playerMovement(socket, movement);
            
        })
    }
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