import './App.css';

//connection btw forentend and backend//
import io from 'socket.io-client'
import {  useState } from 'react';
import Chat from "./Chat.js";



const socket = io.connect("http://localhost:3001");

function App() {
  const [Username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowchat] = useState(false);



  const joinRoom = ()=>{
    if(Username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowchat(true);

    }

  };
  return (
    <div className="App">
      {!showchat ?(

      <div className="joinChatContainer">
      <h3> Join A Chat</h3>
      <input 
      type="text" 
      placeholder="Enter Your Name" 
      onChange={(event) => {
        setUsername(event.target.value);
        }} 
        />
      <input type="text" 
      placeholder="Room ID" 
      onChange={(event) => {
      setRoom(event.target.value);
        }} />
      <button onClick={joinRoom}>Join</button>
      </div>
      )
:
(
      <Chat socket={socket} Username={Username} room={room}/>
)}

 </div>
  );
}

export default App;
