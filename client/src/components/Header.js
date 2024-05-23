import React, { useEffect, useState } from "react";
import Notification from "./Notification";
import api from "../api/axios";
import CreateChat from "./CreateChat";
import socket from "../api/socket";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("id");
  const username = localStorage.getItem("username");

  const handleNotifyOpen = () => {
    setNotifyOpen(true);
  };
  const handleNotifyClose = () => {
    setNotifyOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
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

  useEffect(() => {
    socket.on("messageReceived", (newMessageReceived) => {
      console.log(newMessageReceived);
      const chatId = newMessageReceived.newMessage.message.chatId;
      const senderId = newMessageReceived.newMessage.message.senderId;
      const messageContent = newMessageReceived.newMessage.message.content;
      const senderUsername = newMessageReceived.user;

      // Update the unread count only if the message is not sent by the current user
      if (senderId !== userId) {
        setUnreadCounts((prevCounts) => ({
          ...prevCounts,
          [chatId]: (prevCounts[chatId] || 0) + 1,
        }));

        // Add to notifications
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { chatId, senderUsername, messageContent },
        ]);
      }
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [userId]);

  // Calculate the total unread count for all chats
  const totalUnreadCount = Object.values(unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  // Clear all unread counts
  const clearUnreadCounts = () => {
    setUnreadCounts({});
    setNotifications([]);
  };

  return (
    <>
      <div className="flex sm:items-center justify-between border-b-2 border-gray-200 py-2">
        <div className="flex items-center gap-3">
          <span className="px-2 text-gray-700 text-2xl font-semibold">
            My Chats
          </span>
          <button
            type="button"
            onClick={handleOpen}
            title="New Chat"
            className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 21 21"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                fill="none"
                fillRule="evenodd"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(3 3)"
              >
                <path d="m7 1.5h-4.5c-1.1045695 0-2 .8954305-2 2v9.0003682c0 1.1045695.8954305 2 2 2h10c1.1045695 0 2-.8954305 2-2v-4.5003682" />
                <path d="m14.5.46667982c.5549155.5734054.5474396 1.48588056-.0167966 2.05011677l-6.9832034 6.98320341-3 1 1-3 6.9874295-7.04563515c.5136195-.5178979 1.3296676-.55351813 1.8848509-.1045243z" />
                <path d="m12.5 2.5.953 1" />
              </g>
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <NotificationBadge count={totalUnreadCount} effect={Effect.SCALE} />
            <button
              type="button"
              onClick={handleNotifyOpen}
              className="flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
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
            </button>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
              alt=""
              className="w-5 sm:w-10 h-5 sm:h-10 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl mt-1 flex items-center">
              {username && (
                <span className="mr-3 text-[#f84525] font-semibold">
                  {username}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {notifyOpen && (
        <Notification
          notifications={notifications}
          clearUnreadCounts={clearUnreadCounts}
          handleNotifyClose={handleNotifyClose}
        />
      )}
      {open && (
        <CreateChat
          userId={userId}
          availableUsers={availableUsers}
          handleClose={handleClose}
        />
      )}
    </>
  );
};

export default Header;
