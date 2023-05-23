function userSignIn(socket, registerDialog, e){
    e.preventDefault();

    console.log("submitting username");
    
    const usernameInput = document.querySelector("#usernameInput");
    const username = usernameInput.value;

    // Send username to socket
    socket.emit("newUser", username);

    // Close dialog
    registerDialog.close();
}

export default {
    userSignIn
}