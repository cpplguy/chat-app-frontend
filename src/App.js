import "./App.css";
import SignUpPage from "./signuppage.js";
import LoginPage from "./loginpage.js";
import ProtectedPage from "./protected.js";
import PublicPage from "./public.js";
import NotFound from "./notfound.js";
import ChatPage from "./chatapp.js";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/api/auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          console.log(res)
        }
        setLoading(false);
      })
      .catch((err) => {
        setIsAuth(false);
        console.error("Error fetching auth status:", err);
        setLoading(false);
      });
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicPage isAuth={isAuth}>
              <LoginPage setIsAuth = {setIsAuth} />
            </PublicPage>
          }
        ></Route>
        <Route
          path="/signup"
          element={
            <PublicPage isAuth={isAuth}>
              <SignUpPage setIsAuth = {setIsAuth}/>
            </PublicPage>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <PublicPage isAuth={isAuth}>
              <LoginPage setIsAuth = {setIsAuth} />
            </PublicPage>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedPage isAuth={isAuth}>
              <ChatPage/>
            </ProtectedPage>
          }
        ></Route>
        <Route path = "*" element = {<NotFound/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
