import React, { useState, useEffect } from "react";
import { useNavigate , Navigate} from "react-router-dom";
export default function PublicPage({isAuth, children}){
    if (isAuth) return <Navigate to="/chat" replace />;
    return children;
}