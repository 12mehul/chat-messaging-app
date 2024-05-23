import api from "./axios";

const createChat = async (chatData) => {
  try {
    const response = await api.post("/chats", chatData);
    return response.data;
  } catch (error) {
    console.error("Failed to create chat:", error);
  }
};

const getUserChats = async (userId) => {
  try {
    const response = await api.get(`/chats/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chats list:", error);
  }
};

const getChatDetails = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch chat details:", error);
  }
};

const addUserToChat = async (chatId, userId) => {
  try {
    const response = await api.post("/chats/addUser", { chatId, userId });
    return response.data;
  } catch (error) {
    console.error("Failed to addUser to chat:", error);
  }
};

const removeUserFromChat = async (chatId, userId) => {
  try {
    const response = await api.post("/chats/removeUser", { chatId, userId });
    return response.data;
  } catch (error) {
    console.error("Failed to remove chat user:", error);
  }
};

export {
  createChat,
  getUserChats,
  getChatDetails,
  addUserToChat,
  removeUserFromChat,
};
