const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");

let page = fs.readFileSync('assets/innerHTML/chat_page.html',{encoding: 'utf-8'});

const server = app.listen(3000,()=>{
  console.log("server is running on 3000");
});

let rooms = {};      // object containing room name with an array of participants ID
let participants = {}; // object containing participants ID with their room name (those who have created a room)
let namesID = {};    // object containing all participants with their ID wheher they created a room or not

const io = socketio(server);
app.use(express.static("public"));             // to tell server that the static
app.use(express.static("assets"));             //html files are in "public" folder

io.on("connect", (socket)=>{
  console.log(`${socket.id} connected`);

//*****************************Authentiation**********************
  socket.emit("activeRooms", rooms);

  socket.on("createRoom",(roomName)=>{

    let r = Object.entries(rooms);
    let flag = "YES";
    for(let i = 0; i<r.length; i++){
      if(r[i][0] == roomName){
        flag = "NO";
      }
    }

    if(flag == "YES"){
      socket.join(roomName);
      socket.emit('load_chat_page', page, "YES");
      rooms[`${roomName}`] = [socket.id]
      participants[`${socket.id}`] = roomName;
      namesID[`${socket.id}`] = roomName;
      socket.emit('connection_status', 'no-connection', "");
    }
    else{
      socket.emit('load_chat_page', "NO", "Room Already Created");
    }
  });

  socket.on("get_chat_page",(roomName, name)=>{
    try{
      if(rooms[`${roomName}`].length == 2){
        socket.emit('load_chat_page', "NO", "Room Full");
      }
      else{
        socket.join(roomName);
        socket.emit('load_chat_page', page, "YES");
        rooms[`${roomName}`].push(`${socket.id}`);
        namesID[`${socket.id}`] = roomName;
        participants[`${socket.id}`] = name;

        socket.emit("connection_status", "connected", roomName);
        // let creater = rooms[`$roomName`][0];
        socket.broadcast.in(roomName).emit("connection_status", "connected",name);
      }
      console.log(rooms);
      console.log(participants);
      console.log(namesID);

    }
    catch(e){
      console.log(e);
    }

  });
//*****************************Authentiation ENDS*******************

  // socket.emit('test', {rooms, participants});

//************************Chatting**********************************


socket.on("newMessage", (message)=>{
  let room = namesID[`${socket.id}`]
  // io.sockets.in(room).emit("newMessage", message);
  socket.broadcast.in(room).emit("newMessage", message);
});














//************************Chatting ENDS****************************************

  socket.on("disconnect",()=>{
    try{
      console.log(`${socket.id} disconnected`);
      let id = socket.id;
      let roomID = namesID[`${id}`];

      console.log(`${participants[`${id}`]} left the room`);
      console.log(roomID);
      io.sockets.in(roomID).emit("error", "other one left");
      delete participants[id];      // deleting enteries
      delete namesID[`${id}`];
      console.log(rooms[`${roomID}`]);
      delete rooms[`${roomID}`];
    }
    catch(e){
      console.log(e);
    }

  });

});
