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
  document.getElementById("messageText").focus;
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
}

socket.on("newMessage", (message)=>{
  addMessage(message, "sender");
});
