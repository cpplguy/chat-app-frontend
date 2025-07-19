import React from "react";
import { io } from "socket.io-client";
export default io(`${process.env.REACT_APP_SERVER}`, {
    withCredentials: true,
    transports: ["websocket"],
  });