import React, { useEffect, useState } from "react";
import { getUserChats } from "../api/chatService";
import socket from "../api/socket";
import { useNavigate } from "react-router-dom";
import { markMessageAsRead } from "../api/messageService";

const Dashboard = () => {
  const userId = localStorage.getItem("id");
  const [chats, setChats] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const navigate = useNavigate();
  console.log(unreadCounts);
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
    <div className="w-full h-auto flex justify-items-start">
      <div className="w-[500px] p-6 flex mt-6 ml-10 break-words border shadow-lg rounded">
        <div className="w-full rounded-t mb-0 px-0 border-0">
          <div className="flex flex-wrap items-center px-4 py-2">
            <div className="w-full max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-gray-900">
                Chats List
              </h3>
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="items-center border-collapse">
              <thead>
                <tr>
                  <th className="w-full px-4 bg-gray-100 text-gray-500 align-middle border border-solid border-gray-200 dark:border-gray-500 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"></th>
                </tr>
              </thead>
              <tbody>
                {sortedChats.map((chat) => (
                  <tr
                    key={chat.id}
                    onClick={() => handleChatSelect(chat.id)}
                    className="text-gray-700 cursor-pointer"
                  >
                    <th className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4 text-left">
                      {chat.chatName}
                    </th>
                    <td className="border-t-0 px-4 align-middle border-l-0 border-r-0 text-base whitespace-nowrap p-4">
                      {unreadCounts[chat.id] > 0 &&
                        `(${unreadCounts[chat.id]} new)`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
