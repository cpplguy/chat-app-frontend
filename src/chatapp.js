/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useContext, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import createSocket from "./socket.js";
import AuthContext from "./authcontext.js";
import SideBar from "./sidebar.js";
import Loading from "./misc/loading.js";
import he from "he";
import "./chatapp.css";
export default function ChatPage() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId = "main" } = useParams();
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  //message states
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [messages, setMessages] = useState([]);
  const [whoAmI, setWhoAmI] = useState("");
  //
  const [socketConnected, setSocketConnected] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [peopleOnline, setPeopleOnline] = useState(0);

  const [usernames, setUsernames] = useState(["No One"]);
  const handler = (newMessage) => {
    setMessages(newMessage);
  };
  const handler2 = (users) => {
    if (!isAuth.auth) {
      navigate("/", { replace: true });
      return;
    }
    setUsernames(users);
  };
  const handler3 = (length) => {
    setPeopleOnline(length);
  };
  const connectHandler = () => {
    const socket = socketRef.current;
    console.log("connected to socket server");
    socket.emit("join room", roomId || "main");
    socket.emit("request users connected");
  };
  const errorHandler = (err) => {
    console.error("error has happened while connecting. Error : ", err);
    socketCleanUp();
  };
  const socketCleanUp = () => {
    if (socketRef.current) {
      const socket = socketRef.current;
      socket.off("connect", connectHandler);
      socket.off("chat message", handler);

      socket.off("users connected", handler2);

      socket.off("users online", handler3);

      socket.off("connect_error", errorHandler);

      socket.disconnect();
    }
  };
  const init = () => {
    try {
      if (/[^a-z0-9]/.test(roomId)) {
        navigate("/", { replace: true });
      }
      if (/[A-Z]/.test(roomId)) {
        navigate("/chat/" + roomId.toLowerCase());
      }
      setWhoAmI(isAuth.user);
      if (!isAuth.token) throw new Error("No token provided.");
      const socket = createSocket({ auth: isAuth.token });
      socketRef.current = socket;
      socket.on("connect", connectHandler);
      socket.on("users connected", handler2);
      socket.on("chat message", handler);
      socket.on("users online", handler3);
      socket.on("connect_error", errorHandler);
      socket.connect();
      setSocketConnected(true);
    } catch (err) {
      console.error("Error during init: ", err);
      navigate("/", { replace: true });
    }
  };
  useEffect(() => {
    init();
    return () => socketCleanUp();
  }, [roomId, isAuth?.token]);
  function setDisabledState() {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 3000);
  }
  const sendMessage = (newMessage) => {
    if (!socketRef.current) {
      console.error("socket not mounted");
    }
    socketRef.current.emit("chat message", newMessage, (error) => {
      if (error) {
        navigate("/", { replace: true });
      }
    });
  };
  function sendHandler(e) {
    e.preventDefault();
    if (message.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }
    if (message.length > 100) {
      alert("Message cannot exceed 100 characters.");
      return;
    }
    sendMessage(message);
    setMessage("");
    setDisabledState();
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (!socketConnected) return <Loading />;
  return (
    <>
      <SideBar usernames={usernames} />
      <div id="chat-container">
        <header>
          <h2>
            <em title={roomId}>
              {(roomId.length > 30
                ? roomId.slice(0, 30) + "..."
                : roomId.toLowerCase() !== "main"
                ? roomId
                : "Main Chat") || "Main Chat"}{" "}
              Page
            </em>
          </h2>
          <h2
            id="people-online"
            title="Current amount of users online. Green dot signializes that people (other than you) are online."
          >
            Users Online: {peopleOnline}
            <span
              className={`${peopleOnline > 1 ? "green" : "red"} circle`}
            ></span>
          </h2>
        </header>
        <div id="messages-container">
          <p>
            {messages?.length === 0
              ? "messages will appear here"
              : messages.map((msg) => {
                const d = new Date(msg.createdAt);
                  const date = d.toLocaleDateString();
                  const time = d.toLocaleTimeString();
                  const who = whoAmI !== msg.email;
                  return (
                    <Fragment key={msg._id}>
                      <span>
                        <span className="username" title={msg.email}>
                          {who && (
                            <span
                              className="profile-picture"
                              style={
                                msg.color === "rainbow"
                                  ? {
                                      background:
                                        "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)",
                                      backgroundSize: "400% 400%",
                                      animation: "rainbow 8s infinite",
                                    }
                                  : {
                                      backgroundColor: `${
                                        msg.color || "lightgray"
                                      }`,
                                    }
                              }
                            >
                              <img src="/icons8-account-48.png" alt="pfp" />
                            </span>
                          )}
                          {who
                            ? msg.email?.length > 21
                              ? msg.email.slice(0, 10) +
                                "..." +
                                msg.email.slice(
                                  msg.email.length - 9,
                                  msg.email.length
                                )
                              : msg.email
                            : ""}{" "}
                          {who && date}{" "}
                          {who &&
                            time.slice(0, +time.slice(0, 2) ? 5 : 4) +
                              time.slice(-2).replace(":", "")}
                        </span>
                        <span
                          className={`${
                            !who
                              ? "user message"
                              : "client message"
                          }`}
                        >
                          {he.decode(msg.text)}
                        </span>
                      </span>
                      <br />
                    </Fragment>
                  );
                })}
          </p>
          <div
            id="bottom"
            ref={bottomRef}
            style={{ position: "absolute", bottom: "0" }}
          ></div>
        </div>
        <section id="input-container-container">
          <div id="input-container">
            <div id="char-count-container">
              <p
                id="char-count"
                style={{ color: messageLength > 100 ? "red" : "gainsboro" }}
              >
                {messageLength}/100
              </p>
            </div>
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setMessageLength(e.target.value.length);
              }}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  message.trim() &&
                  !disabled &&
                  messageLength <= 100
                ) {
                  sendHandler(e);
                }
              }}
              placeholder="Type your message."
            />
            <button
              disabled={!message.trim()}
              id="send-message"
              onClick={(e) => {
                sendHandler(e);
              }}
            >
              <h1>↑</h1>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
