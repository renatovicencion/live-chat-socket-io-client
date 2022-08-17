import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({ socket, username, room }) => {

    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const handleOnChangeCurrentMessage = (e) => {
        setCurrentMessage(e.target.value)
    }

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: username,
                message: currentMessage,
                time: String(new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });
    }, [socket]);

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="livePoint"></div>
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {
                        messageList.map((messageContent, key) => (
                            <div key={key} className="message" id={username === messageContent.author ? "other" : "you"}>
                                <div>
                                    <div className="message-content">
                                        <p>{messageContent.message}</p>
                                    </div>

                                    <div className="message-meta">
                                        <p id="time">{messageContent.time}</p>
                                        <p id="author">{messageContent.author}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input 
                    type="text"
                    value={currentMessage}
                    placeholder="Hey..." 
                    onChange={handleOnChangeCurrentMessage} 
                    onKeyDown={(e) => {
                        e.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane} /></button>
            </div>
        </div>
    );
};

export default Chat;