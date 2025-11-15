import { useContext } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import AuthContext from "../authcontext";
import {deleteCookies} from "./deletecookies.js";
export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isSettings = location.pathname === "/settings";
  const { isAuth } = useContext(AuthContext);

  if (isAuth.auth && location.pathname !== "/bannedPage" ) {
    return (
      <nav>
        <div id = "nav-container">
        <button id = "settings" onClick = {() => navigate(`${isSettings ? '/' : '/settings'}`)}>
          <h3>{isSettings ? "Go Back" : "Settings"}</h3>
        </button>
        <button id="logout" onClick={deleteCookies}>
          <h3>Log Out</h3>
        </button>
        
        {/*<button onClick = {() => navigate("/about")}>About</button>*/}
        </div>
          
      </nav>
    );
  }
}
