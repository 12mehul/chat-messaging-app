import React, { useEffect, useState } from "react";
import { getUserChats, removeUserFromChat } from "../api/chatService";
import socket from "../api/socket";
import { useNavigate } from "react-router-dom";
import { markMessageAsRead } from "../api/messageService";

const Dashboard = () => {
  const userId = localStorage.getItem("id");
  const [chats, setChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const userChats = await getUserChats(userId);
      setChats(userChats);
    };

    fetchChats();

    socket.on("messageReceived", (newMessageReceived) => {
      const chatMessage = newMessageReceived.newMessage.message;

      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [chatMessage.chatId]: (prevCounts[chatMessage.chatId] || 0) + 1,
      }));
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [userId]);

  const handleChatSelect = async (chatId) => {
    navigate(`/chat/${chatId}`);
    // Fetch messages for the selected chat
    const selectedChat = chats.find((chat) => chat.id === chatId);
    if (selectedChat && selectedChat.messages) {
      // Mark all unread messages in the chat as read
      for (let message of selectedChat.messages) {
        if (message.readBy && !message.readBy.includes(userId)) {
          try {
            await markMessageAsRead(message.id, userId);
            // Update the unread counts
            setUnreadCounts((prevCounts) => ({
              ...prevCounts,
              [chatId]: (prevCounts[chatId] || 1) - 1,
            }));
          } catch (error) {
            console.error("Failed to mark message as read:", error);
          }
        }
      }
    }
  };

  const handleRemoveUser = async (chatId) => {
    try {
      await removeUserFromChat(chatId, userId);
      // Filter out the removed chat from the state
      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (error) {
      console.error("Error removing user from chat:", error);
    }
  };

  const getChatDisplayName = (chat) => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    const otherUser = chat.users.find((user) => user.id !== userId);
    return otherUser ? otherUser.username : "User";
  };

  const sortedChats = [...chats].sort((a, b) => {
    const dateA = a.latestMessage
      ? new Date(a.latestMessage.createdAt)
      : new Date(0);
    const dateB = b.latestMessage
      ? new Date(b.latestMessage.createdAt)
      : new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="container w-full h-auto flex justify-items-start mx-auto shadow-lg rounded-lg">
      <div className="flex flex-col flex-auto h-full p-6">
        <div className="lg:w-[50%] w-[70%] flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-[#f8f4f3] h-full p-4 shadow-md">
          {sortedChats.map((chat) => (
            <div
              className="flex flex-col border-r-2 overflow-y-auto"
              key={chat.id}
            >
              <div className="flex py-4 px-2 items-center border-b-2 border-l-4 border-blue-400">
                <div
                  className="w-full flex cursor-pointer"
                  onClick={() => handleChatSelect(chat.id)}
                >
                  <div className="w-1/4">
                    <img
                      src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
                      className="object-cover h-12 w-12 rounded-full"
                      alt=""
                    />
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <div className="text-lg font-semibold">
                      {getChatDisplayName(chat)}
                    </div>
                    {unreadCounts[chat.id] > 0 && (
                      <div className="flex items-center justify-center font-semibold text-xs text-white bg-green-500 h-5 w-5 rounded-full leading-none">
                        {`${unreadCounts[chat.id]}`}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="w-1/4 text-base font-semibold text-gray-800 hover:text-[#f84525]"
                  onClick={() => handleRemoveUser(chat.id)}
                >
                  Leave Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
