import { io } from "socket.io-client";
export default function createSocket(cookies){
   return io(process.env.REACT_APP_SERVER, {
    withCredentials: true,
    auth: cookies,
    transports: ["websocket"],
    autoConnect:false,
  });
}