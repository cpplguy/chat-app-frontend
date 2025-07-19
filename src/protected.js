import React, {useState, useEffect} from "react";
import { useNavigate, Navigate } from "react-router-dom";
export default function ProtectedPage({ children, isAuth }){
    const [auth, setAuth] = useState(false);
    if(!isAuth) return <Navigate to="/login" replace />;
    return children;
}