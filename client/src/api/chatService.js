import api from "./axios";

const createChat = async (chatData) => {
  const response = await api.post("/chats", chatData);
  return response.data;
};

const getUserChats = async (userId) => {
  const response = await api.get(`/chats/user/${userId}`);
  return response.data;
};

const addUserToChat = async (chatId, userId) => {
  const response = await api.post("/chats/addUser", { chatId, userId });
  return response.data;
};

const removeUserFromChat = async (chatId, userId) => {
  const response = await api.post("/chats/removeUser", { chatId, userId });
  return response.data;
};

export { createChat, getUserChats, addUserToChat, removeUserFromChat };
