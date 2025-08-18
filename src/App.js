import "./App.css";
import SignUpPage from "./signuppage.js";
import LoginPage from "./loginpage.js";
import ProtectedPage from "./protected.js";
import PublicPage from "./public.js";
import NotFound from "./misc/notfound.js";
import ChatPage from "./chatapp.js";
import Refresh from "./reload.js";
import AuthContext from "./authcontext.js";
import Loading from "./misc/loading.js";
import { Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
function App() {
  const [isAuth, setIsAuth] = useState({ user: null, token: null, auth: false });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  useEffect(() => {
    (async() => {
    try{
    const fetchAuth = await fetch(
      `${
        !(process.env.REACT_APP_STATUS === "development")
          ? "/api/auth"
          : process.env.REACT_APP_SERVER + "/api/auth"
      }`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
        if (fetchAuth.ok) {
          const fetchAuthData = await fetchAuth.json();
          setIsAuth({ auth: true, user: fetchAuthData.user, token: fetchAuthData.token });
        } else {
          console.log("Not authenticated, status code: ", fetchAuth.status);
          setIsAuth((prev) => ({ ...prev, auth: false }));
          
        }
        setLoading(false);
      }
      catch(err) {
        setIsAuth((prev) => ({ ...prev, auth: false }));
        console.error("Error fetching auth status:", err);
        setLoading(false);
      }
    }
    )()
  }, [location]);
  if (loading) return <Loading />;
  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <Refresh />
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
          <Route path="/reload" element={<Loading />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </AuthContext.Provider>
  );
}
export default App;
