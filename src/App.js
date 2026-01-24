import "./App.css";
import SignUpPage from "./signuppage.js";
import LoginPage from "./loginpage.js";
import ProtectedPage from "./componentwrappers/protected.js";
import RestrictedPage from "./componentwrappers/restricted.js";
import PublicPage from "./componentwrappers/public.js";
import NotFound from "./misc/notfound.js";
import ChatPage from "./chatapp.js";
import AuthContext from "./authcontext.js";
import Loading from "./misc/loading.js";
import BannedPage from "./misc/banned.js";
import Dashboard from "./admin/dashboard.js";
import NavBar from "./misc/navbar.js";
import About from "./misc/about.js";
import Settings from "./settings.js";
import {RawMessagePage, RawUserPage} from "./admin/rawdata.js";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteCookies } from "./misc/deletecookies.js";
function App() {
  const location = useLocation();
  const backendPath = `${/*
    !(process.env.REACT_APP_STATUS === "development")
      ? "/api/auth"
      :*/ process.env.REACT_APP_SERVER + "/api/auth"
  }`;
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState({
    user: null,
    token: null,
    auth: false,
  });
  const [bannedMessage, setBannedMessage] = useState("No reason given");
  const [bannedToken, setBannedToken] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if(!localStorage.getItem("loggedOut3" /*add number to the localStorage key
       to make sure everybody gets logged out,
       or like change the name idk */ )){
      localStorage.setItem("loggedOut3","true")
      deleteCookies();
      navigate("/login",{replace:true} );
    }
  },[navigate])
  useEffect(() => {
    (async () => {
      try {
        const fetchAuth = await fetch(backendPath, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const fetchAuthData = await fetchAuth.json();
        if (fetchAuth.ok) {
          setIsAuth({
            auth: true,
            user: fetchAuthData.user,
            token: fetchAuthData.token,
          });
          setBannedToken(false);
          console.log("user authenticated");
        } else if (fetchAuth.status === 403) {
          console.log("User is banned.");
          setIsAuth((prev) => ({ ...prev, auth: false }));
          setBannedMessage((prev) => fetchAuthData.bannedReason || prev);
          setBannedToken(true);
          if (location.pathname !== "/bannedPage") {
            setTimeout(() => {
              navigate("/bannedPage", { replace: true });
            }, 50);
          }
        } else if (fetchAuth.status === 401) {
          console.log("Not authenticated, status code: ", fetchAuth.status);
          setIsAuth((prev) => ({ ...prev, auth: false }));
        }
        setLoading(false);
      } catch (err) {
        setIsAuth((prev) => ({ ...prev, auth: false }));
        console.error("Error fetching auth status:", err);
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);
  /*useEffect(() => {
    const bannedHandler = (e) => {
      if (e.key === "isBanned" && e.newValue === "true") {
        setIsAuth((prev) => ({ ...prev, auth: false }));
        navigate("/bannedPage", { replace: true });
      }
    };
    window.addEventListener("storage", bannedHandler);
    return () => window.removeEventListener("storage", bannedHandler);
  }, [navigate]);*/
  if (loading) return <Loading />;
  return (
    <AuthContext.Provider
      value={{ isAuth, setIsAuth, bannedToken, bannedMessage, setBannedToken, setBannedMessage }}
    >
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <PublicPage>
              <LoginPage />
            </PublicPage>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicPage>
              <SignUpPage />
            </PublicPage>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <PublicPage>
              <LoginPage />
            </PublicPage>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedPage>
              <ChatPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedPage>
              <ChatPage />
            </ProtectedPage>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedPage>
              <RestrictedPage>
                <Dashboard />
              </RestrictedPage>
            </ProtectedPage>
          }
        />
        <Route path="/admin/rawUserData" element={<RawUserPage />} />
        <Route path="/admin/rawMessageData" element={<RawMessagePage />} />
        <Route path="/reload" element={<Loading />} />
        <Route path="/bannedPage" element={<BannedPage />} />
        <Route path="/about" element={<About />} />
        <Route path = "/settings" element = {<Settings/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthContext.Provider>
  );
}
export default App;
