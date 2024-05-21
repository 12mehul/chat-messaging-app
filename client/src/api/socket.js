import io from "socket.io-client";

const token = localStorage.getItem("token");

let socket;

if (token) {
  socket = io("http://localhost:5000", {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Connected to server");
  });

  socket.on("connect_error", (err) => {
    console.log("Connection error:", err);
  });
} else {
  console.log("Token not available.");
}

export default socket;
