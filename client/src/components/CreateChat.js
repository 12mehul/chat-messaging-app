import React, { useState } from "react";
import { createChat } from "../api/chatService";
import { toast } from "react-toastify";

const CreateChat = ({ userId, availableUsers, handleClose }) => {
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCreateGroupChat = async (e) => {
    e.preventDefault();
    if (!chatName) {
      toast.error("Please enter a chat name");
      return;
    }

    const chatData = {
      chatName,
      isGroupChat: true,
      users: selectedUsers,
      groupAdmin: userId,
    };

    try {
      const chat = await createChat(chatData);
      if (chat) {
        toast.success("Group Chat created.");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
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
      <form onSubmit={handleCreateGroupChat}>
        <div className="max-w-sm rounded-3xl bg-gradient-to-b from-sky-300 to-purple-500 p-px">
          <div className="rounded-[calc(1.5rem-1px)] bg-white px-10 p-12">
            <div className="flex gap-3">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#2563eb"
                  strokeWidth="0.36"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <g id="style=doutone">
                      <g id="email">
                        <path
                          id="vector (Stroke)"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                          fill="#2563eb"
                        ></path>
                        <path
                          id="vector (Stroke)_2"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                          fill="#2563eb"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                Create a Group Chat
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
              <div>
                <h2 className="text-base font-semibold text-gray-800">
                  Select Users:
                </h2>
                {availableUsers?.map((user) => (
                  <div key={user.id}>
                    <label className="flex gap-3 items-center space-x-2 text-base font-semibold text-gray-700">
                      {user.username}
                      <input
                        className="bg-transparent text-gray-600 rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500"
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                      />
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
