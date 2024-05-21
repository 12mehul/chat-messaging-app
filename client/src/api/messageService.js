import api from "./axios";

const sendMessage = async (messageData) => {
  try {
    const response = await api.post("/messages", messageData);
    return response.data;
  } catch (error) {
    console.error("Failed to send message:", error);
  }
};

const getChatMessages = async (chatId) => {
  try {
    const response = await api.get(`/messages/chat/${chatId}`);
    return response.data.messages;
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
  }
};

const markMessageAsRead = async (messageId, userId) => {
  const response = await api.post("/messages/markAsRead", {
    messageId,
    userId,
  });
  return response.data;
};

export { sendMessage, getChatMessages, markMessageAsRead };
