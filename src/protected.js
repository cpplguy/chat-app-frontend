import { Navigate } from "react-router-dom";
export default function ProtectedPage({ children, isAuth }){
    if(!isAuth) return <Navigate to="/login" replace />;
    return children;
}