import { useContext } from "react";
import AuthContext from "./authcontext";
export default function NavBar() {
  const backendPath = `${
    !(process.env.REACT_APP_STATUS === "development")
      ? "/api/users/logout"
      : process.env.REACT_APP_SERVER + "/api/users/logout"
  }`;
  const { isAuth } = useContext(AuthContext);
  async function deleteCookies() {
    try {
      const fetc = await fetch(backendPath, {
        method: "DELETE",
        credentials: "include",
      });
      if (!fetc.ok) {
        return alert("error occured. error: ", await fetc.json());
      }
      window.location.reload();
    } catch (err) {
      alert("error occured, error: ", err);
    }
  }
  if (isAuth.auth) {
    return (
      <nav>
        <button id="logout" onClick={deleteCookies}>
          <h3>Log Out</h3>
        </button>
      </nav>
    );
  }
}
