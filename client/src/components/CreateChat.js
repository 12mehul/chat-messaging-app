import React, { useState } from "react";
import { createChat } from "../api/chatService";

const CreateChat = ({ userId, availableUsers, handleClose }) => {
  const [chatName, setChatName] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupAdmin, setGroupAdmin] = useState(userId);

  const handleCreateChat = async () => {
    const chatData = {
      chatName,
      isGroupChat,
      users: selectedUsers,
      groupAdmin,
    };

    try {
      const chat = await createChat(chatData);
      console.log("Chat created:", chat);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.includes(userId)
        ? prevUsers.filter((id) => id !== userId)
        : [...prevUsers, userId]
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <form onSubmit={handleCreateChat}>
        <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Create a new Chat
              </h1>
            </div>
            <div className="mt-8 space-y-8">
              <div className="space-y-3">
                <input
                  className="w-full bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                  type="text"
                  placeholder="Chat Name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="flex gap-3 items-center space-x-2 text-base font-semibold text-gray-800">
                  Group Chat
                  <input
                    className="bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                    type="checkbox"
                    checked={isGroupChat}
                    onChange={(e) => setIsGroupChat(e.target.checked)}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Select Users
                </h2>
                {availableUsers?.map((user) => (
                  <div key={user.id}>
                    <label>
                      <input
                        className="w-full bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                      />
                      {user.username}
                    </label>
                  </div>
                ))}
              </div>
              <button
                className="relative h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 transition duration-500 rounded-md text-white"
                type="submit"
              >
                Create Chat
              </button>
              <button
                onClick={handleClose}
                className="relative h-9 px-3 w-full bg-gray-600 hover:bg-gray-700 transition duration-500 rounded-md text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateChat;
