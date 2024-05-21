import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { createChat } from "../api/chatService";

const Sidebar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  const isTokenExpired = (token) => {
    try {
      if (token === null) return true;
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      // If token decoding fails, assume it's expired
      return true;
    }
  };

  useEffect(() => {
    if (!token) return;
    if (isTokenExpired(token)) {
      // Token has expired, handle it (e.g., redirect to login page)
      window.location.href = `/`;
      localStorage.clear();
      console.log("Token has expired");
      return;
    }
    // Token is still valid
    console.log("Token is still valid");
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users?search=${searchTerm}`
      );
      setUsers(response.data.users);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
    setLoading(false);
  };

  const handleCreateChat = async (selectedUser) => {
    if (!selectedUser) return;

    const chatData = {
      chatName: selectedUser.username,
      isGroupChat: false,
      users: [selectedUser.id, userId],
      groupAdmin: userId,
    };

    try {
      const chat = await createChat(chatData);
      console.log("Chat created:", chat);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <>
      <div className="lg:w-1/4 w-[45%] h-[690px] flex flex-col gap-5 p-2 bg-[#f8f4f3] border-r border-gray-300 border shadow-lg">
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300">
          <div className="flex rounded-full px-2 w-full bg-gray-300">
            <input
              type="search"
              className="w-full bg-gray-300 flex pl-2 text-gray-700 outline-0 rounded-full cursor-pointer"
              placeholder="Search User..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="relative p-2 bg-gray-300 rounded-full"
            >
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                    stroke="#999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300">
          {loading && <p>Loading...</p>}
          <ul>
            {users.map((user) => (
              <li key={user.id} className="flex gap-2">
                <span>{user.username}-</span>
                <button
                  className="text-base font-semibold text-gray-800 hover:text-[#f84525]"
                  onClick={() => handleCreateChat(user)}
                >
                  Select
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <a
            href="/dashboard"
            className="w-full flex font-semibold gap-3 text-lg items-center py-2 px-4 text-gray-900 hover:bg-gray-400 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 cursor-pointer"
          >
            <div>
              <svg
                className="h-6 w-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            Users
          </a>
          <a
            className="w-full flex font-semibold gap-3 text-lg items-center py-2 px-4 text-gray-900 hover:bg-gray-400 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 cursor-pointer"
            onClick={handleLogout}
          >
            <div>
              <svg
                className="h-6 w-6"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            </div>
            Sign out
          </a>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
