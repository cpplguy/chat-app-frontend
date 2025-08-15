import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./authcontext.js";
export default function RestrictedPage({ children }){
    const { isAuth } = useContext(AuthContext);
    if (isAuth) return <Navigate to="/" replace />;
    return children;
}