import React, { useEffect, useState } from "react";
import { getUserChats } from "../api/chatService";
import socket from "../api/socket";
import { useNavigate } from "react-router-dom";

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

    socket.on("newMessage", (message) => {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [message.chatId]: (prevCounts[message.chatId] || 0) + 1,
      }));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [userId]);

  const handleChatSelect = (chatId) => {
    navigate(`/chat/${chatId}`);
  };

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
                {chats.map((chat) => (
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
