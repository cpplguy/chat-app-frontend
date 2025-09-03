import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./authcontext.js";
export default function LoginPage() {
  const backendPath = `${
    !(process.env.REACT_APP_STATUS === "development")
      ? "/api/users/signup"
      : process.env.REACT_APP_SERVER + "/api/users/postUserInfo"
  }`;
  const { setIsAuth } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();
  function handleKey(e) {
    if (e.key === "Enter") {
      postCredentials({ name: name, password: pass });
    }
  }
  async function postCredentials(obj) {
    if (!name || !pass) {
      return alert("Please fill in all forms");
    }

    try {
      const fet = await fetch(backendPath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
        credentials: "include",
      });
      const data = await fet.json();
      switch (fet.status) {
        case 400:
          alert("Please enter a valid email address.");
          return;
        case 409:
          alert("Email already exists.");
          return;
        case 429:
          alert(data.error);
          return;
        case 201:
          console.log("Successful: User created.");
          setIsAuth({ auth: true, user: data.user, token: data.token });
          return;
        default:
          alert(`Server code: ${fet.status}. Error message: ${fet.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert(`An error has occured. Error: ${err.message}`);
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
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          postCredentials({ name: name, password: pass });
        }}
      >
        <h1 className="main-text">Signup</h1>
        <label>
          Name:
          <input
            maxLength={254}
            onKeyDown={(e) => handleKey(e)}
            type="email"
            value={name}
            placeholder="Type email address..."
            onChange={(e) =>
              e.target.value.length < 254 && setName(e.target.value)
            }
            required
          />
          <button
            type="button"
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
            type="button"
            className="clear"
            onClick={(e) => {
              e.preventDefault();
              setPass("");
            }}
          >
            X
          </button>
        </label>
        <button type="submit">Make account</button>
        <button
          className="navigate"
          type="button"
          onClick={() => navigate("/")}
        >
          Already have an account? Click here to login
        </button>
      </form>
      <br />
    </section>
  );
}
