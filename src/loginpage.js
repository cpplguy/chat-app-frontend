import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage({ setIsAuth }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  function handleKey(e) {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }
  async function login(obj) {
    const fetc = await fetch(
      `${process.env.REACT_APP_SERVER}/api/users/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      }
    );
    switch (fetc.status) {
      case 404:
        alert("User not found.");
        console.log("no user");
        return;
      case 401:
        alert("Incorrect password.");
        console.log("incorrect pass");
        return;
      case 429:
        const error = await fetc.json();
        alert(error.error);

        return;
      case 200:
        const data = await fetc.json();
        setIsAuth(true);
        console.log("Successful: User logged in. user info: ", data);

        return;
      default:
        alert(`Server code: ${fetc.status}. Error message: ${fetc.statusText}`);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (name && pass) {
      await login({ name: name, password: pass });
    } else {
      alert("Please fill in all fields");
    }
  }
  return (
    <>
      <section className="page" id = "login">
        <div className="logo">
          <h1>
            Chat <span className="green">App</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <label>
            Name:
            <input
              onKeyDown={(e) => handleKey(e)}
              type="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Type email address..."
            />
            <button
              id="clearname"
              className="clear"
              onClick={(e) => {
                e.preventDefault();
                setName("");
              }}
            >
              X
            </button>
          </label>
          <br />
          <label>
            Password:
            <input
              onKeyDown={(e) => handleKey(e)}
              placeholder="Type your password..."
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
            <button
              id="clearform"
              className="clear"
              onClick={(e) => {
                e.preventDefault();
                setPass("");
              }}
            >
              X
            </button>
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        <div class = "navigate-container">
        <button className="navigate" onClick={() => navigate("/signup")}>
          Don't have an account? Sign up here
        </button>
        </div>
      </section>
    </>
  );
}
