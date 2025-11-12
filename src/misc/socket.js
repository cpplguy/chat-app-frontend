import { io } from "socket.io-client";
export default function createSocket(cookies) {
  return io(process.env.REACT_APP_SERVER, {
    withCredentials: true,
    auth: { ...cookies },
    device: /mobile/i.test(navigator.userAgent) ? "mobile" : "computer",
    autoConnect: false,
  });
}
