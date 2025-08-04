import React, { useEffect } from "react";
import {  useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import popSound from './popp.mp3' ;
import { useRef } from "react";


function Chat({socket,Username,room}){
    const [message,setMessage]=useState("");
    const [messageslist,setMessageslist]=useState([]);
    const audioRef = useRef(new Audio(popSound));




    const  sendMessage = async() =>{
        if(message !==""){
            //time bataiga
            const messagedata ={
                room:room,
                author: Username,
                message:message,
                time: new Date(Date.now()).getHours() +
                ":"+
                new Date(Date.now()).getMinutes(),

            };
            await socket.emit('send_message',messagedata);
            setMessageslist((list) => 

                Array.isArray(list)?[...list, messagedata]: [messagedata] );
                setMessage("");


        };
    
      
      setMessage("");
      audioRef.current.play();
     



    }

// 🎉 Emoji click effect
const handleMessageClick = (e) => {
    if(!e|| !e.target) return;
    const emojis = ["✨", "🔥", "💥", "💫", "🌟", "🎉"];
    const burst = document.createElement("span");
    burst.className = "burst";
    burst.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    burst.style.position = "absolute";
    burst.style.fontSize = "20px";
    burst.style.animation = "fadeOut 1s ease-out";
    burst.style.pointerEvents = "none";

    const rect = e.target.getBoundingClientRect();
    burst.style.left = `${e.clientX - rect.left}px`;
    burst.style.top = `${e.clientY - rect.top}px`;

    e.target.appendChild(burst);

    setTimeout(() => burst.remove(), 1000);
  };



            

    //listen when there is any changes//

    useEffect(() =>{
        socket.off("receive_message").on("receive_message", (data) => {
            console.log("RECIVED MESSAGES" , data);

            setMessageslist((list) => 

                Array.isArray(list)?[...list, data]: [data] 
            );

        });


    }, [socket]);

    return (
        <div className="chat-window">
        <div className="chat-header"> 
            <p>Live Chat</p>
        </div>
        
        <div className="chat-body"> 
        <ScrollToBottom className="message-container">
          {messageslist.map((messageContent,index) => {
            return (
              <div
                key={index}
                className="message"
                id={Username === messageContent.author ? "you" : "other"}
                onClick={handleMessageClick}
              >
                
                <div>
                  <div 
                  className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );

        })}
        </ScrollToBottom>

        </div>
        <div className="chat-footer"> 
            <input 
            type="text" 
            value={message}
             placeholder="hey..."
            onChange={(event) => {
           setMessage(event.target.value);
        }}
        onKeyPress= {(event) => {
            event.key === "Enter" && sendMessage();
        }}

         />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
        </div>
    );
}

export default Chat;  //export the component