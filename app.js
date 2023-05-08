import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import path from 'path';
import router from './router/router.js';
import session from 'express-session';

import lobbySocket from './sockets/lobby.js';

const sessionLength = (1000 * 60 * 60 * 24) * 7; // 1 day

const __dirname = path.resolve();
const port = process.env.PORT || 5500;

const app = express(); 
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server);

app.set('view engine', 'hbs');  
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/'));
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);

app.use(session({
  name: 'chatsession',
  secret: "chatsecretsessiondata",
  saveUninitialized:true,
  cookie: { maxAge: sessionLength },
  resave: false
}));


let onlineUsers = [];

io.on('connection', (socket) => {

  lobbySocket(io, socket, onlineUsers);

})



server.listen(process.env.PORT || port, () => {
  console.log('Example app listening on port 5500!');
});

app.engine('hbs',
handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
    partialsDir: [
      path.join(__dirname, 'views', 'partials')
    ]
}));

app.use('/', router);