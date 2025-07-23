import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function LoginPage({ setIsAuth }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  function handleKey(e) {
    if (e.key === "Enter") {
      postCredentials({ name: name, password: pass });
    }
  }
  async function postCredentials(obj) {
    if (name && pass) {
      try {
        const fet = await fetch(
          `${process.env.REACT_APP_SERVER}/api/users/postUserInfo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(obj),
            credentials: "include",
          }
        );
        switch (fet.status) {
          case 400:
            alert("Please enter a valid email address.");
            return;
          case 409:
            alert("Email already exists.");
            return;
          case 429:
            const error = await fet.json();
            alert(error.error);
            return;
          case 200:
            console.log("Successful: User created.");
            setIsAuth(true);
            return;
          default:
            alert(
              `Server code: ${fet.status}. Error message: ${fet.statusText}`
            );
        }
      } catch (err) {
        console.error(err);
        alert(`An error has occured. Error: ${err.message}`);
      }
    } else {
      alert("Please fill in all forms");
    }
  }

  return (
    <section className="page" id="signup">
      <div className="logo">
        <h1>
          Chat <span className="green">App</span>
        </h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          postCredentials({ name: name, password: pass });
        }}
      >
        <h1>Signup</h1>
        <label>
          Name:
          <input
            onKeyDown={(e) => handleKey(e)}
            type="email"
            value={name}
            placeholder="Type email address..."
            onChange={(e) => setName(e.target.value)}
            required
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
        <label>
          Password:
          <input
            onKeyDown={(e) => handleKey(e)}
            type="password"
            value={pass}
            placeholder="Type password..."
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
        <button type="submit" disabled={!name || !pass}>
          Make account
        </button>
      </form>
      <div className = "navigate-container">
      <button className="navigate" onClick={() => navigate("/")}>
        Already have an account? Click here to login
      </button>
      </div>
      <br />
    </section>
  );
}
