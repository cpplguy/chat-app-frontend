import { io } from "socket.io-client";
export default io("/api", {
    withCredentials: true,
    transports: ["websocket"],
  });