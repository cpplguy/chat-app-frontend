import { useContext } from "react";
import AuthContext from "../authcontext.js";
import { Navigate } from "react-router-dom";
export default function BannedPage() {
  const { bannedToken, bannedMessage } = useContext(AuthContext);
  if (!bannedToken || !bannedToken) {
    return <Navigate to="/" replace />;
  }
  return (
    <div style = {{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",textAlign:"center", height: "100vh"}}>
      <h1>Your account has been banned. Banned Message: {bannedMessage} </h1>
      <h2 style = {{textAlign:"center"}}>
        To appeal the ban (possibly get unbanned), please email{" "}
        <a href="mailto:ramonguo136@gmail.com">ramonguo136@gmail.com</a>
      </h2>
    </div>
  );
}
