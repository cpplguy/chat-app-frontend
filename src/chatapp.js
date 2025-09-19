/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  Fragment,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import createSocket from "./socket.js";
import AuthContext from "./authcontext.js";
import SideBar from "./sidebar.js";
import Loading from "./misc/loading.js";
import he from "he";
import filterObscenity from "./obscenity.js";
import "./chatapp.css";
const CensorWordsMemo = React.memo(({ text }) => filterObscenity(text));
export default function ChatPage() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId = "main" } = useParams();
  const bottomRef = useRef(null);
  const topRef = useRef(null);
  const socketRef = useRef(null);
  //message states
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [messages, setMessages] = useState([]);
  const [whoAmI, setWhoAmI] = useState("");
  const [messageViewedIndex, setMessageViewedIndex] = useState(null);
  // eslint-disable-next-line
  const [amountOfMessages, setAmountOfMessages] = useState(0);
  //
  const [disabled, setDisabled] = useState(false);
  const [peopleOnline, setPeopleOnline] = useState(0);

  const [usernames, setUsernames] = useState(["No One"]);

  useEffect(() => {
    const handler = (newMessage) => {
      setMessages(newMessage);
      setAmountOfMessages(newMessage.length);
    };
    const handler2 = (users) => {
      if (!isAuth.auth) {
        navigate("/");
        return;
      }
      setUsernames(users);
    };
    const handler3 = (length) => {
      setPeopleOnline(length);
    };
    const connectHandler = () => {
      const socket = socketRef.current;

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
          navigate("/");
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
        console.log("connected to socket server");
      } catch (err) {
        console.error("Error during init: ", err);
        navigate("/", { replace: true });
      }
    };
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
    if (disabled) return;
    e.preventDefault();
    if (message.trim() === "") {
      alert("Message cannot be empty.");
      return;
    }
    const matc = message.match(/image\((.*?)\)/i);
    if (message.length > 100 && !(/:bypass/i.test(message) && message.length < 1000) && !matc) {
      alert("Message cannot exceed character limit.");
      return;
    }

    if (matc) {
      sendMessage(matc[0]);
    } else {
      sendMessage(message);
    }
    setMessage("");
    setDisabledState();
    setMessageLength(0);
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (peopleOnline === 0) return <Loading />; // uses peopleOnline to determine whether page has loaded. Much better than a seperate usestate.
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
          <button id = "copy-chat-data" onClick = {() => {
            navigator.clipboard.writeText(`roomId: ${roomId}\n data-format: JSON \n\n` + messages.map((itm) => {
              itm.text.match(/image\((.*?)\)/i) ? itm.text = "[Image]" : itm.text = he.decode(itm.text);
              const {__v, _id, ...rest} = itm;
              return JSON.stringify(rest, null, 2)
            })).then(() => alert("Chat messages copied to clipboard")).catch((err) => console.error("failed to copy. Error: ", err));
          }}>Copy Chat Messages</button>
        </header>
        {/*
        <div id="message-length-container-container">
            <div id="message-length-container">
              <h6>{amountOfMessages}</h6>
            </div>
          </div>*/}
        <div id="messages-container">
          <div ref={topRef} id = "top"></div>
          <p>
            {messages?.length === 0
              ? "messages will appear here"
              : messages.map((msg, idx) => {
                  const userMessage = he.decode(msg.text);
                  const d = new Date(msg.createdAt);
                  const date = d.toLocaleDateString();
                  const time = d.toLocaleTimeString();
                  const who = whoAmI !== msg.email;
                  const matc = msg.text.match(/image\((.*?)\)/i);

                  return (
                    <Fragment key={msg._id}>
                      <span
                        className="user-message-container"
                        
                      >
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
                            !who ? "user message" : "client message"
                          }`}
                          onMouseEnter={() => setMessageViewedIndex(idx)}
                        onMouseLeave={() => setMessageViewedIndex(null)}
                        >
                          
                          {matc ? (
                            <img
                              src={matc[1]}
                              alt="user-image"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://img.freepik.com/free-photo/abstract-luxury-plain-blur-grey-black-gradient-used-as-background-studio-wall-display-your-products_1258-101806.jpg?semt=ais_hybrid&w=740&q=80";
                              }}
                            />
                          ) : messageViewedIndex === idx ? (
                            userMessage
                          ) : (
                            <CensorWordsMemo text={userMessage} />
                          )}
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
                if (e.key === "Enter") {
                  if (
                    (message.trim() && !disabled && messageLength <= 100) ||
                    /:bypass/i.test(message) ||
                    message.match(/image\((.*?)\)/i)
                  ) {
                    sendHandler(e);
                  }
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
