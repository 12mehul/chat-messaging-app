// import React, { useEffect, useState } from "react";
// import { getUserChats } from "../api/chatService";
// import { sendMessage, getChatMessages } from "../api/messageService";
// import socket from "../api/socket";

// const Chat = ({ userId }) => {
//   const [chats, setChats] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [unreadCounts, setUnreadCounts] = useState({});

//   useEffect(() => {
//     const fetchChats = async () => {
//       const userChats = await getUserChats(userId);
//       setChats(userChats);
//     };

//     fetchChats();

//     socket.on("newMessage", (message) => {
//       if (message.chatId === selectedChat) {
//         setMessages((prevMessages) => [...prevMessages, message]);
//       } else {
//         setUnreadCounts((prevCounts) => ({
//           ...prevCounts,
//           [message.chatId]: (prevCounts[message.chatId] || 0) + 1,
//         }));
//       }
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [userId, selectedChat]);

//   const handleChatSelect = async (chatId) => {
//     setSelectedChat(chatId);
//     const chatMessages = await getChatMessages(chatId);
//     setMessages(chatMessages);
//     // Mark messages as read
//     setUnreadCounts((prevCounts) => ({
//       ...prevCounts,
//       [chatId]: 0,
//     }));
//   };

//   const handleSendMessage = async () => {
//     if (newMessage.trim() && selectedChat) {
//       const message = await sendMessage({
//         senderId: userId,
//         content: newMessage,
//         chatId: selectedChat,
//       });
//       //   setMessages([...messages, message]);
//       setNewMessage("");
//     }
//   };

//   return (
//     <div>
//       <h1>Chats</h1>
//       <ul>
//         {chats.map((chat) => (
//           <li key={chat.id} onClick={() => handleChatSelect(chat.id)}>
//             {chat.chatName}{" "}
//             {unreadCounts[chat.id] > 0 && `(${unreadCounts[chat.id]} new)`}
//           </li>
//         ))}
//       </ul>

//       {selectedChat && (
//         <div>
//           <h2>Messages</h2>
//           <ul>
//             {messages?.map((message) => (
//               <li key={message.id}>
//                 <strong>{message.sender.username}:</strong> {message.content}
//               </li>
//             ))}
//           </ul>
//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//           />
//           <button onClick={handleSendMessage}>Send</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Chat;
