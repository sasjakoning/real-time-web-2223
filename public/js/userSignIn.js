function userSignIn(socket, registerDialog, e){
    e.preventDefault();

    console.log("submitting username");
    
    const usernameInput = document.querySelector("#usernameInput");
    const username = usernameInput.value;

    // send username to socket
    socket.emit("newUser", username);

    // close dialog
    registerDialog.close();
}

export default {
    userSignIn
}