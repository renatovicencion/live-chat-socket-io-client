import { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import Chat from './components/Chat';

const socket = io.connect("https://live-chat-socket-io-server.vercel.app/");

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleOnChangeUsername = (e) => {
    setUsername(e.target.value)
  }

  const handleOnChangeRoom = (e) => {
    setRoom(e.target.value);
  }

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };
  
  return (
    <div className="App">
      {
        !showChat ?
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input type="text" placeholder="John..." onChange={handleOnChangeUsername} />
          <input type="text" placeholder="Room ID..." onChange={handleOnChangeRoom} />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
        :
        <Chat 
            socket={socket} 
            username={username} 
            room={room} 
          />
          
      }
    </div>
  );
};

export default App;
