import React, { useEffect, useState } from "react";
import CreateChat from "./CreateChat";
import Notification from "./Notification";
import api from "../api/axios";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import socket from "../api/socket";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const username = localStorage.getItem("username");
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

  useEffect(() => {
    socket.on("newMessage", (message) => {
      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNotifyOpen = () => {
    setNotifyOpen(true);
  };
  const handleNotifyClose = () => {
    setNotifyOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  const fetchRelatedUsers = async () => {
    try {
      const response = await api.get("/users");
      const users = response.data.users;
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error fetching related users:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchRelatedUsers();
  }, []);

  return (
    <>
      <div className="w-1/4 h-[690px] flex flex-col gap-5 p-2 bg-[#f8f4f3] border-r border-gray-300">
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-300">
          <div className="flex items-center">
            <div>
              {username && (
                <span className="text-[#f84525] px-2 text-xl font-semibold">
                  {username}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleNotifyOpen}
            className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            <NotificationBadge count={unreadCount} />
          </button>
        </div>
        <div className="flex items-start border-b py-2 border-gray-300">
          <a
            className="w-full flex font-semibold gap-3 text-lg items-center py-2 px-4 text-gray-900 hover:bg-gray-400 hover:text-gray-100 rounded-md group-[.active]:bg-gray-800 group-[.active]:text-white group-[.selected]:bg-gray-950 group-[.selected]:text-gray-100 cursor-pointer"
            onClick={handleOpen}
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
                <path stroke="none" d="M0 0h24v24H0z" />
                <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </div>
            Create Chat
          </a>
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
      {open && (
        <CreateChat
          userId={userId}
          availableUsers={availableUsers}
          handleClose={handleClose}
        />
      )}
      {notifyOpen && <Notification handleNotifyClose={handleNotifyClose} />}
    </>
  );
};

export default Sidebar;
