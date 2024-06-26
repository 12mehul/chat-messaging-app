import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChatMessages, sendMessage } from "../api/messageService";
import socket from "../api/socket";
import { getChatDetails } from "../api/chatService";

function Chat() {
  const { chatId } = useParams();
  const userId = localStorage.getItem("id");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [title, setTitle] = useState("");

  const fetchMessages = async () => {
    const chatMessages = await getChatMessages(chatId);
    setMessages(chatMessages);
  };

  const fetchChatDetails = async () => {
    const details = await getChatDetails(chatId);
    if (details.isGroupChat) {
      setTitle(details.chatName);
    } else {
      const otherUser = details.users.find((user) => user.id !== userId);
      setTitle(otherUser?.username || "User");
    }
  };

  useEffect(() => {
    socket.emit("joinChat", chatId);

    const handleNewMessage = (newMessageReceived) => {
      const chatMessage = newMessageReceived.newMessage.message;
      const senderUsername = newMessageReceived.user;

      if (chatMessage.chatId === chatId) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: chatMessage.id,
            content: chatMessage.content,
            senderId: chatMessage.senderId,
            sender: { username: senderUsername },
          },
        ]);
      }
    };

    fetchMessages();
    fetchChatDetails();

    socket.on("messageReceived", handleNewMessage);

    // Cleanup function to remove the event listener
    return () => {
      socket.off("messageReceived", handleNewMessage);
    };
  }, [chatId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = await sendMessage({
        senderId: userId,
        content: newMessage,
        chatId: chatId,
      });
      socket.emit("newMessage", message);
      setNewMessage("");
    }
  };

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <div className="flex flex-col flex-auto h-full p-6">
        <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-[#f8f4f3] h-full p-4 shadow-md">
          <div className="flex sm:items-center justify-between border-b-2 border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                alt=""
                className="w-5 sm:w-10 h-5 sm:h-10 rounded-full"
              />
              <div className="flex flex-col leading-tight">
                <div className="text-2xl mt-1 flex items-center">
                  {title && <span className="text-gray-700 mr-3">{title}</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-auto h-0 p-4 overflow-y-auto">
            <div
              id="messages"
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
            >
              {messages &&
                messages?.map((message) => (
                  <div className="chat-message" key={message.id}>
                    <div
                      className={`flex items-end ${
                        message.senderId === userId ? "justify-end" : ""
                      }`}
                    >
                      <div
                        className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 ${
                          message.senderId === userId
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div>
                          <span
                            className={`px-4 py-2 rounded-lg inline-block ${
                              message.senderId === userId
                                ? "rounded-br-none bg-blue-600 text-white"
                                : "rounded-bl-none bg-gray-300 text-gray-600"
                            }`}
                          >
                            {message.senderId !== userId &&
                              `${message.sender.username}: `}
                            {message.content}
                          </span>
                        </div>
                      </div>
                      <img
                        src={
                          message.senderId === userId
                            ? "https://images.unsplash.com/photo-1590031905470-a1a1feacbb0b?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                            : "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=3&amp;w=144&amp;h=144"
                        }
                        alt="My profile"
                        className="w-6 h-6 rounded-full order-1"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="border-t-2 border-gray-200 pt-4 mb-2">
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    ></path>
                  </svg>
                </button>
              </span>
              <input
                type="text"
                placeholder="Write your message!"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
              />
              <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  type="submit"
                  onClick={handleSendMessage}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                >
                  <span className="font-bold">Send</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-6 w-6 ml-2 transform rotate-90"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
