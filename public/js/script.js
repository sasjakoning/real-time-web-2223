
import movement from "/js/playerMovement.js";

movement.playerMovement()



// let socket = io();
// let messages = document.querySelector(".chat");
// let input = document.querySelector(".chatInput");
// const chatForm = document.querySelector(".textInput")

// const usernameForm = document.querySelector("#usernameForm");

// /* ---------- set username ---------- */

// if(usernameForm) {
//     usernameForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         const usernameInput = document.querySelector("#usernameInput");
//         const username = usernameInput.value;
//         socket.emit("setUsername", username);
//     });

//     socket.on("userSet", (data) => {
//         // change url to /chat
//         // window.location.href = "/chat";

//         const usernameFormContainer = document.querySelector(
//             "#usernameForm"
//           );
//         usernameFormContainer.style.display = "none";
//     })
// }

// /* -------------- chat -------------- */

// if (chatForm){

//     chatForm.addEventListener("submit", (e) => {
//       e.preventDefault();
//       if (input.value) {
//         const message = input.value;
//         const senderId = socket.id;
//         socket.emit("chatMessage", { message, senderId });
//         input.value = "";
//       }
//     });
    
//     socket.on("chatMessage", (data) => {
//         console.log(data)
//         const { message, username, senderId } = data;
        
//         const isFromSelf = senderId === socket.id;
        
//         console.log(message, username)
//         // add the message to the DOM
//         const listItem = document.createElement("li");

//         if(!isFromSelf){
//             const userTitle = document.createElement("p");
//             userTitle.textContent = username;

//             listItem.appendChild(userTitle);

//             listItem.classList.add("receivedText");
//         }else {
//             listItem.classList.add("sentText");

//         }

//         const userMessage = document.createElement("p");
//         userMessage.textContent = message;

//         listItem.appendChild(userMessage);


//         messages.appendChild(
//         // create a new li element
//         Object.assign(listItem)
//         );

//         messages.scrollTop = messages.scrollHeight;
//     });
// }



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