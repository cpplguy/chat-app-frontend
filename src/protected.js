import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "./authcontext.js";
export default function ProtectedPage({ children }) {
  const { isAuth } = useContext(AuthContext);
  if (!isAuth.auth) return <Navigate to="/login" replace />;
  return children;
}
