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

    // handle currently online users by adding to user list
    socket.on("onlineUsers", (onlineUsers) => {
        console.log("currently online users: ", onlineUsers);
        for (let id in onlineUsers) {

            // add to user list if not current user
            if(id !== playerId && onlineUsers.hasOwnProperty(id)) {
                console.log("adding user through socket.on onlineUsers", id, playerId)
                addPlayer(id, onlineUsers[id].x, onlineUsers[id].y);
            }

            // turn onlineUsers into an array
            const onlineUsersArray = Object.entries(onlineUsers);

            updateUserlist(onlineUsersArray);

        }
    });


    // handle new user
    socket.on("userConnected", (onlineUsers, id) => {
        console.log("user connected, new userlist: ", onlineUsers);
        for (let id in onlineUsers) {
            if(id === playerId && onlineUsers.hasOwnProperty(id)) {
                console.log("adding user through socket.on userConnected")
                addPlayer(id, onlineUsers[id].x, onlineUsers[id].y);
            }

            // turn onlineUsers into an array
            const onlineUsersArray = Object.entries(onlineUsers);

            updateUserlist(onlineUsersArray);
        }
    });


    socket.on("playerId", (id) => {
        console.log("setting player id: ", id);
        playerId = id;
    });

    document.addEventListener("keydown", (e) => {
        const player = document.getElementById(playerId);
        // get size of player

        const playerWidth = player.offsetWidth;
        const playerHeight = player.offsetHeight;

        const container = document.querySelector(".container");

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // if keydown is w a s d
        if (e.key === "w" || e.key === "a" || e.key === "s" || e.key === "d") {
            socket.emit("keydown", { key: e.key, playerWidth, playerHeight, containerWidth, containerHeight });
        }
    });

    socket.on("updatePlayer", (data) => {
        const player = document.getElementById(data.id);

        if(player) {

            player.style.left = `${data.x}%`;
            player.style.top = `${data.y}%`;

        } else {
            addPlayer(data.id, data.x, data.y);
        }
    });


    // handle user disconnect by removing from user list
    socket.on("userDisconnected", (onlineUsers) => {


        if (!Object.keys(onlineUsers).length === 0) {
            updateUserlist(onlineUsers);
        }

        // // fix this
        // while (userList.firstChild) {
        //     userList.removeChild(userList.firstChild);
        // }

        // // repopulate the user list
        // for (let username in onlineUsers) {
        //     console.log("username: ", username)
        //     const newUser = document.createElement("li");

        //     const newUserTitle = document.createElement("p");

        //     newUserTitle.textContent = username;

        //     newUser.appendChild(newUserTitle);

        //     userList.appendChild(
        //         // create a new li element
        //         Object.assign(newUser)
        //     );
        // }
    });


    // get user register form
    const usernameForm = document.querySelector("#usernameForm");

    // handle user register form submit
    usernameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("submitting username")
        const usernameInput = document.querySelector("#usernameInput");
        const username = usernameInput.value;

        // send username to socket
        socket.emit("newUser", username);

        // close dialog
        registerDialog.close();
    });

    // // handle new user
    // socket.on("newUser", (data, id) => {

    //     console.log("New user joined: ", data);
    //     console.log("With socket id: ", id);

    //     // create a new player element in DOM
    //     const newPlayerElement = document.createElement("div");
    //     newPlayerElement.classList.add("player");
    //     newPlayerElement.dataset.playerId = id;
    //     playerContainer.appendChild(newPlayerElement);


    //     // add new user to user list
    //     const newUser = document.createElement("li");
    //     const newUserTitle = document.createElement("p");
    //     newUserTitle.textContent = data;
    //     newUser.appendChild(newUserTitle);
    //     userList.appendChild(
    //         // create a new li element
    //         Object.assign(newUser)
    //     );

    //     // // store the current movement direction
    //     // let movement = { x: 0, y: 0 };

    //     // // trigger player insertion and movement
    //     // movementHandler.playerMovement(socket, movement);

    // });

    
}

function addPlayer(id, x, y) {
    const player = document.createElement("div");

    player.id = id;
    player.classList.add("player");

    playerContainer.appendChild(player);

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

    // // add to user list
    // const newUser = document.createElement("li");
    // const newUserTitle = document.createElement("p");
    // newUserTitle.textContent = username;
    // newUser.appendChild(newUserTitle);
    // userList.appendChild(
    //     // create a new li element
    //     Object.assign(newUser)
    // );
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