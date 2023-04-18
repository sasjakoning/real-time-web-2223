
// function socketSetup(io, socket) {
    
//         console.log(`User connected: ${socket.id}`);
//         // io.emit('history', history)
      
//         socket.on("setUsername", (username) => {
//           socket.username = username;
//           socket.emit("userSet", { username });
//         });
      
//         socket.on('chatMessage', (data) => {
//           // while (history.length > historySize) {
//           //   history.shift()
//           // }
//           // history.push(message)
      
//           const { message, senderId } = data;
//           const username = socket.username;
//           const isFromSelf = senderId === socket.id;
//           const chatMessage = message;
//           const chatUsername = username;
      
//           console.log(chatMessage)
      
//           io.emit('chatMessage', { 
//             message: chatMessage,
//             username: chatUsername,
//             isFromSelf,
//             senderId })
//         })
      
//         socket.on('disconnect', () => {
//           console.log(`User disconnected: ${socket.id}`);
//         })

// }

// export default socket;