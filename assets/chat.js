try{
  document.addEventListener("keydown",(event)=>{
    if(event.key == "Enter"){
      document.getElementsByClassName("send")[0].click();
    }
  });

}
catch(e){
  console.log(e);
}


function sendMessage(){
  let message = document.getElementById("messageText").value;
  console.log(message);
  if(message == ""){
    console.log("no message enetered");
  }
  else{
    socket.emit("newMessage", message);
    addMessage(message, "reciever");
  }
  document.getElementById("messageText").value = "";
  document.getElementById("messageText").focus();
}

function addMessage(message, sOr){
  let chatBox = document.getElementsByClassName("chats")[0];
  let div = document.createElement("div");
  div.innerHTML = message;

  if(sOr == "reciever"){
    div.setAttribute("class", "chat-body reciever");
  }
  else{
    div.setAttribute("class", "chat-body sender");
  }
  chatBox.appendChild(div);
  let = chats = document.getElementsByClassName("chats")[0];
  chats.scrollTo(0, chats.scrollHeight);
}

socket.on("newMessage", (message)=>{
  addMessage(message, "sender");
});

socket.on('connection_status',(status, name)=>{
  let element = document.getElementsByClassName("status")[0];
  if(status == "no-connection"){
    element.style.backgroundColor = "#ff414d";
    element.innerHTML = "NO ONE CONNETED YET";
  }
  else if(status == "connected"){
    element.style.backgroundColor = "#28df99"
    element.innerHTML = name + " connected"
  }
});
