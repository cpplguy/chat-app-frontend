import { useState, useEffect, useRef, useContext, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import createSocket from "./socket.js";
import AuthContext from "./authcontext.js";
import SideBar from "./sidebar.js";
import "./chatapp.css";
export default function ChatPage() {
  const { isAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { roomId = "main" } = useParams();
  const bottomRef = useRef(null);
  const socketRef = useRef(null);
  //message states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [whoAmI, setWhoAmI] = useState("");
  //
  const [disabled, setDisabled] = useState(false);
  const [peopleOnline, setPeopleOnline] = useState(0);
  // Stuff for form
  const [usernames, setUsernames] = useState(["No One"]);
  //

  //fns

  //
  useEffect(() => {
    const handler = (newMessage) => {
      setMessages(newMessage);
    };
    const handler2 = (users) => {
      if (!isAuth) {
        navigate("/", { replace: true });
        return;
      }
      setUsernames(users);
    };
    const handler3 = (length) => {
      setPeopleOnline(length);
    };
    const errorHandler = (err) => {
      console.error("error has happened while connecting. Error : ", err)
    }
    //IMPORTANT connects socket
    fetch(
      `${
        !(process.env.REACT_APP_STATUS === "development")
          ? "/api/chat/whoami"
          : process.env.REACT_APP_SERVER + "/api/chat/whoami"
      }`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          navigate("/", { replace: true });
        } else {
          throw new Error(
            `Unexpected status code: ${res.status}, error: ${res.error}`
          );
        }
      })
      .then((data) => {
        setWhoAmI(data.email);
        if (!data.token) throw new Error("No token provided.")
        const socket = createSocket(data.token);
        socketRef.current = socket;
        socket.connect();
          socket.emit("join room", roomId || "main");
          socket.on("users connected", handler2);
          socket.on("chat message", handler);
          socket.on("users online", handler3);
          socket.emit("request users connected");
          socket.on("connect_error", errorHandler)
        })
      .catch((err) => console.error("Error fetching, err: ", err));

    return () => {
      if (socketRef.current) {
        const socket = socketRef.current
        socket.off("chat message", handler);

        socket.off("users connected", handler2);

        socket.off("users online", handler3);

        socket.off("connect_error", errorHandler)

        socket.disconnect();
      }
    };
  }, [navigate, isAuth, roomId]);
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
              : messages.map((msg, idx) => {
                  const date = new Date(msg.createdAt);
                  const who = whoAmI !== msg.email;
                  return (
                    <Fragment key={msg._id}>
                      <span>
                        <span className="username">
                          {who && (
                            <span
                              className="profile-picture"
                              style={{
                                backgroundColor: `${msg.color || "lightgray"}`,
                              }}
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
                            : ""}
                          {who && date.toLocaleDateString()}{" "}
                          {who &&
                            date.toLocaleTimeString().slice(0, 5) +
                              date.toLocaleTimeString().slice(-2)}
                        </span>
                        <span
                          className={`${
                            whoAmI === msg.email
                              ? "user message"
                              : "client message"
                          }`}
                        >
                          {msg.text}
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
            <input
              type="text"
              value={message}
              onChange={(e) => {
                if (e.target.value.length > 100) {
                  alert("Message cannot exceed 100 characters.");
                  return;
                }
                setMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim() && !disabled) {
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
