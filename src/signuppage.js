import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext.js";
export default function LoginPage() {
  const backendPath = `${process.env.REACT_APP_SERVER + "/api/users/postUserInfo"}`;
  const { setIsAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  async function postCredentials(obj) {
    if (!name || !pass) { alert("Please fill in all forms"); return; }
    let json;
    try {
      const fet = await fetch(backendPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
        credentials: "include",
      });
      const data = await fet.json();
      json = JSON.stringify(data);
      switch (fet.status) {
        case 400: alert("Please enter a valid email address."); return;
        case 409: alert("Email already exists."); return;
        case 429: alert(json); return;
        case 201:
          setIsAuth({ auth: true, user: data.user, token: data.token });
          return;
        default: alert(`Server code: ${fet.status}. Error message: ${json}`);
      }
    } catch (err) {
      alert(`An error has occured. Error: ${json}`);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    let previousAccounts = JSON.parse(localStorage.getItem("previousAccounts") || "[]");
    if (!Array.isArray(previousAccounts)) previousAccounts = [];
    if (previousAccounts.sort().at(-1) > 255) previousAccounts = [];
    previousAccounts = [...new Set([...previousAccounts, name.trim().toLowerCase()])];
    localStorage.setItem("previousAccounts", JSON.stringify(previousAccounts));
    await postCredentials({ name, password: pass, previousAccounts: previousAccounts.slice(0, 20) || [] });
  }
  function handleKey(e) {
    if (e.key === "Enter") handleSubmit(e);
  }
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Ctext y='75' font-size='60' transform='rotate(-30 50 50)' opacity='0.12' fill='white'%3E%E2%99%9C%3C/text%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
      backgroundSize: "80px 80px",
      backgroundColor: "#313338",
    }}>
      <div style={{
        backgroundColor: "#2b2d31",
        borderRadius: "16px",
        padding: "40px",
        width: "380px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        <h1 style={{ color: "#FFFF99", margin: "0 0 8px 0", fontSize: "2rem", fontWeight: 900, textAlign: "center", width: "100%" }}>
          The <span style={{ color: "#FFFF99" }}>Facility</span>
        </h1>
        <p style={{ color: "#b5bac1", margin: 0, fontSize: "0.9rem", textAlign: "center", width: "100%" }}>Create your account!</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ color: "#b5bac1", fontSize: "0.85rem", fontWeight: "bold" }}>EMAIL</label>
          <input
            type="email"
            value={name}
            maxLength={254}
            onChange={e => e.target.value.length < 254 && setName(e.target.value)}
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
          Make Account
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            color: "#b5bac1",
            padding: "6px 0",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => e.target.style.color = "white"}
          onMouseLeave={e => e.target.style.color = "#b5bac1"}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
