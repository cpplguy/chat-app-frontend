import "./App.css";
import SignUpPage from "./signuppage.js";
import LoginPage from "./loginpage.js";
import ProtectedPage from "./protected.js";
import PublicPage from "./public.js";
import NotFound from "./misc/notfound.js";
import ChatPage from "./chatapp.js";
import Refresh from "./reload.js";
import AuthContext from "./authcontext.js";
import Loading from "./misc/loading.js"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesReceived, setMessagesReceived] = useState(false);
  useEffect(() => {
    fetch(
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
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch((err) => {
        setIsAuth(false);
        console.error("Error fetching auth status:", err);
      });
  }, []);
  useEffect(() => {
    if(!isAuth || messagesReceived){
      setLoading(false);
    }
    if(!messagesReceived && isAuth){
      setLoading(true);
    }
  }, [isAuth, messagesReceived])
  if (loading) return <Loading/>;
  return (
    <AuthContext.Provider value = {{isAuth, setIsAuth, setMessagesReceived}}>
    <BrowserRouter>
      <Refresh/>
      <Routes>
        <Route
          path="/"
          element={
            <PublicPage isAuth={isAuth}>
              <LoginPage setIsAuth={setIsAuth} />
            </PublicPage>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicPage isAuth={isAuth}>
              <SignUpPage setIsAuth={setIsAuth} />
            </PublicPage>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <PublicPage isAuth={isAuth}>
              <LoginPage setIsAuth={setIsAuth} />
            </PublicPage>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedPage isAuth={isAuth}>
              <ChatPage isAuth={isAuth} />
            </ProtectedPage>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedPage isAuth={isAuth}>
              <ChatPage isAuth={isAuth} />
            </ProtectedPage>
          }
        />
        <Route path = "/reload" element = {<Loading/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
  );
}
export default App;
