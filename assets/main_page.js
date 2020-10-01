const socket = io();

function createRoom(){
  let roomName = document.getElementById("roomName").value;
  if(roomName === ""){
    alert("Enter Nickname");
  }
  else{
    console.log(`new room will be created by the name ${roomName}`);
    socket.emit('createRoom', `${roomName}`);
    // socket.emit("get_chat_page");
  }
}

socket.on("test", (testString)=>{   // for testing purposes
  console.log(testString);
});

socket.on("activeRooms", (r)=>{
  console.log(r);
  let parent = document.getElementById("activeRooms");
  let rooms = Object.entries(r);
  for(let i = 0; i<rooms.length; i++){
    let child = document.createElement("div");
    child.setAttribute('class', "active-rooms");
    child.setAttribute('onclick', "joinRoom(this)");
    child.innerText = rooms[i][0];
    parent.appendChild(child);
  }
});

socket.on("load_chat_page",(page, message)=>{

  if(message === "YES"){
    document.body.innerHTML = "";
    document.body.innerHTML = page;

    let s = document.getElementsByClassName("chats")[0];
    s.addEventListener("wheel",()=>{
      s.scrollBy(0,event.deltaY*10);
    });
  }
  else{
    alert(message);
  }

});


function joinRoom(e){
  console.log(e.innerHTML);
  let name = document.getElementById("roomName").value;
  if(name != ""){
    socket.emit("get_chat_page", e.innerHTML, name);
  }
  else{
    alert("please enter your nick name");
  }
}

socket.on("error", (message)=>{
  console.log("error");
  alert(message);
  location.replace(location.href);
});
