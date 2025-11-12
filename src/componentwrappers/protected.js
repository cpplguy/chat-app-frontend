import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../authcontext.js";
export default function ProtectedPage({ children }) {
  const { isAuth, bannedToken } = useContext(AuthContext);
  if(bannedToken) return <Navigate to="/bannedPage" replace />;
  if (!isAuth.auth) return <Navigate to="/login" replace />;
  return children;
}
