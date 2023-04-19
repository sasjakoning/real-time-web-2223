
import movementHandler from "/js/playerMovement.js";



let socket = io();
let currentUser;
socket.emit("getOnlineUsers");
const lobby = document.querySelector(".lobby");





if (lobby){

    socket.on("onlineUsers", (onlineUsers) => {
        console.log("online users:", onlineUsers)
        for(username in onlineUsers){
            console.log("username: ", username)
            const newUser = document.createElement("li");

            const newUserTitle = document.createElement("p");
    
            newUserTitle.textContent = data.username;
    
            newUser.appendChild(newUserTitle);
    
            userList.appendChild(
                // create a new li element
                Object.assign(newUser)
            );
        }
    })

    // store the current movement direction
    let movement = { x: 0, y: 0 };
    
    movementHandler.playerMovement(socket, movement);

}


const usernameForm = document.querySelector("#usernameForm");
const userList = document.querySelector(".userList");

/* ---------- set username ---------- */

if(usernameForm) {

    usernameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("submitting username")
        const usernameInput = document.querySelector("#usernameInput");
        const username = usernameInput.value;
        socket.emit("newUser", username);
    });

    socket.on("newUser", (data) => {

        console.log("New user joined: ", data)

        const newUser = document.createElement("li");

        const newUserTitle = document.createElement("p");

        newUserTitle.textContent = data;

        newUser.appendChild(newUserTitle);

        userList.appendChild(
            // create a new li element
            Object.assign(newUser)
        );
        
    })
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