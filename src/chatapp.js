import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import socket from "./socket.js";
import "./chatapp.css";
export default function ChatPage() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [whoAmI, setWhoAmI] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [peopleOnline, setPeopleOnline] = useState(0);
  const [users, setUsers] = useState([])
  function setDisabledState() {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 3000);
  }
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
    fetch(`${process.env.REACT_APP_SERVER}/api/users/whoami`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 401) {
          alert("You are not authenticated. Please log in.");
          navigate("/", { replace: true });
        } else {
          throw new Error(`Unexpected status code: ${res.status}`);
        }
      })
      .then((data) => {
        setWhoAmI(data.email);
        console.log("Who am i data: ", data.email);
      });
    const handler = (newMessage) => {
      setMessages(newMessage);
    };
    const handler2 = (users) => {
      setPeopleOnline(users.length);
      setUsers(users);
      console.log(users);
    }
    socket.on("chat message", handler);

    socket.on("users connected", handler2)

    socket.emit("request users connected");
    return () => {
      socket.off("chat message", handler);

      socket.off("users connected", handler2)
    };
  }, []);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  useEffect(() => {
    if (!sessionStorage.getItem("refresh")) {
      sessionStorage.setItem("refresh", "true");
      window.location.reload();
    }
  }, []);
  function sendMessage(newMessage) {
    socket.emit("chat message", newMessage, (error) => {
      if (error) {
        navigate("/", { replace: true });
      }
    });
  }
  return (
    <div id="chat-container">
      <header>
        <h2><em>Chat Page</em></h2>
        <h2 id="people-online">Users Online: {peopleOnline}<span className ={`${peopleOnline > 1 ? "green" : "red"} circle`}></span></h2>
      </header>
      <div id="messages-container">
        <p>
          {messages?.length === 0
            ? "messages will appear here"
            : messages.map((msg, idx) => {
                return (
                  <>
                    <span key={idx}>
                      <span className="username">
                        {whoAmI !== msg.email
                          ? msg.email?.length > 21
                            ? msg.email.slice(0, 10) +
                              "..." +
                              msg.email.slice(msg.email.length - 9, msg.length)
                            : msg.email
                          : ""}
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
                  </>
                );
              })}
        </p>
        <div
          id="bottom"
          ref={bottomRef}
          style={{ position: "absolute", bottom: "0" }}
        ></div>
      </div>
      <div id="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            if (e.target.value.length > 70) {
              alert("Message cannot exceed 70 characters.");
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
          <h1>
          ↑
          </h1>
        </button>
      </div>
    </div>
    /**<h1>
        {usernames &&
          usernames.map((items, idx) => (
            <div key={idx}>
              user {idx + 1}. {items}
            </div>
          ))}
      </h1> */
  );
}
