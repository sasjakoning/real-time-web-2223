function sendChat(socket) {
    const chatForm = document.querySelector(".chat__form");

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const chatInput = document.querySelector(".chat__input");
        const chatMessage = chatInput.value;
        chatInput.value = "";

        socket.emit("sendChat", { message: chatMessage, id: socket.id});
    });
}

function receiveChat(socket, data) {
    const userId = data.userId;
    const username = data.username;
    const message = data.message;
    
    const chat = document.querySelector(".chat__messages");
    const chatMessageContainer = document.createElement("div");
    chatMessageContainer.classList.add("chat__message");

    // check if message is from current user
    if (userId === socket.id) {
        chatMessageContainer.classList.add("chat__message--send");
    }else {
        chatMessageContainer.classList.add("chat__message--received");
        const chatMessageName = document.createElement("p");
        chatMessageName.textContent = `${username}`;
        chatMessageContainer.appendChild(chatMessageName);
    }

    const chatMessage = document.createElement("p");
    chatMessage.textContent = `${message}`;

    chatMessageContainer.appendChild(chatMessage);
    chat.appendChild(chatMessageContainer);

    chat.scrollTop = chat.scrollHeight;
}

export default {  
    sendChat,
    receiveChat
}