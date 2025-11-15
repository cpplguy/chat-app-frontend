import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext.js";
export default function LoginPage() {
  const backendPath = `${
    /*
          !(process.env.REACT_APP_STATUS === "development")
            ? "/api/users/login"
            :*/ process.env.REACT_APP_SERVER + "/api/users/login"
  }`;
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  function handleKey(e) {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  }
  async function login(obj) {
    if (!name || !pass) {
      alert("Please fill in all fields");
      return;
    }
    const fetc = await fetch(backendPath, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    const data = await fetc.json();
    const json = JSON.stringify(data);
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
        alert("too many requests, please wait a few minutes.");

        return;
      case 200:
        setIsAuth({ auth: true, user: data.user, token: data.token });
        console.log("Successful: User logged in.");

        return;
      default:
        alert(`Server code: ${fetc.status}. Error message: ${json}`);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    await login({ name: name, password: pass });
  }
  return (
    <>
      <section className="page" id="login">
        <div className="logo">
          <h1>
            Chat <span className="green">App</span>
          </h1>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <h1 className="main-text">Login</h1>
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
          <button
            className="navigate"
            type="button"
            onClick={() => navigate("/signup")}
          >
            Don't have an account? Sign up here
          </button>
        </form>
      </section>
    </>
  );
}
