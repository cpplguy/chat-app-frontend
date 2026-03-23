import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext.js";
export default function LoginPage() {
  const backendPath = `${process.env.REACT_APP_SERVER + "/api/users/login"}`;
  const { setIsAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  function handleKey(e) {
    if (e.key === "Enter") handleSubmit(e);
  }
  async function login(obj) {
    if (!name || !pass) { alert("Please fill in all fields"); return; }
    const fetc = await fetch(backendPath, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });
    const data = await fetc.json();
    const json = JSON.stringify(data);
    switch (fetc.status) {
      case 404: alert("User not found."); return;
      case 401: alert("Incorrect password."); return;
      case 429: alert("Too many requests, please wait a few minutes."); return;
      case 200:
        setIsAuth({ auth: true, user: data.user, token: data.token });
        return;
      default: alert(`Server code: ${fetc.status}. Error message: ${json}`);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    let previousAccounts = JSON.parse(localStorage.getItem("previousAccounts") || "[]");
    if (!Array.isArray(previousAccounts)) previousAccounts = [];
    if (previousAccounts.sort().at(-1) > 255) previousAccounts = [];
    previousAccounts = [...new Set([...previousAccounts, name.trim().toLowerCase()])];
    localStorage.setItem("previousAccounts", JSON.stringify(previousAccounts));
    await login({ name, password: pass, previousAccounts: previousAccounts.slice(0, 20) || [] });
  }
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#313338",
    }}>
      <div style={{
        position: "relative",
        backgroundColor: "#2b2d31",
        borderRadius: "16px",
        padding: "40px",
        width: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        {/* Title */}
      <h1 style={{ color: "#FFFF99", margin: "0 0 8px 0", fontSize: "2rem", fontWeight: 900, textAlign: "center", width: "100%" }}>
          The <span style={{ color: "#FFFF99" }}>Facility</span>
        </h1>
        <p style={{ color: "#b5bac1", margin: 0, fontSize: "0.9rem", textAlign: "center", width: "100%" }}>Lambchop Says Hai</p>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#b5bac1", fontSize: "0.85rem", fontWeight: "bold" }}>EMAIL</label>
          <input
            type="email"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter your email..."
            style={{
              backgroundColor: "#1e1f22",
              border: "1px solid #4e5058",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "white",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#b5bac1", fontSize: "0.85rem", fontWeight: "bold" }}>PASSWORD</label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Enter your password..."
            style={{
              backgroundColor: "#1e1f22",
              border: "1px solid #4e5058",
              borderRadius: "8px",
              padding: "10px 14px",
              color: "white",
              fontSize: "1rem",
              outline: "none",
            }}
          />
        </div>

        {/* Login button */}
        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#5865F2",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "1rem",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "8px",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.target.style.backgroundColor = "#4752C4"}
          onMouseLeave={e => e.target.style.backgroundColor = "#5865F2"}
        >
          Login
        </button>

        {/* Sign up button bottom right */}
        <button
          onClick={() => navigate("/signup")}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: "none",
            border: "1px solid #4e5058",
            color: "#b5bac1",
            borderRadius: "8px",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.target.style.borderColor = "#5865F2"}
          onMouseLeave={e => e.target.style.borderColor = "#4e5058"}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
