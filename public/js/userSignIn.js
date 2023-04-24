function userSignIn(socket, registerDialog){
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
}

export default {
    userSignIn
}