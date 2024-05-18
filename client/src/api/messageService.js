import api from "./axios";

const sendMessage = async (messageData) => {
  const response = await api.post("/messages", messageData);
  return response.data;
};

const getChatMessages = async (chatId) => {
  const response = await api.get(`/messages/chat/${chatId}`);
  return response.data.messages;
};

const markMessageAsRead = async (messageId, userId) => {
  const response = await api.post("/messages/markAsRead", {
    messageId,
    userId,
  });
  return response.data;
};

export { sendMessage, getChatMessages, markMessageAsRead };
