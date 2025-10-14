import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Loading from "./misc/loading.js";
export default function RestrictedPage({ children }) {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const adminFetch = async () => {
    const fetchAdmin = await fetch(
      `${/*
        !(process.env.REACT_APP_STATUS === "development")
          ? "/api/admin"
          : */process.env.REACT_APP_SERVER + "/api/admin"
      }`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (fetchAdmin.ok) {
      console.log(await fetchAdmin.json());
      setAdmin(true);
      setLoading(false);
    } else if (fetchAdmin.status === 403) {
      console.log("User is not an admin.");
      navigate("/", { replace: true });
    }
  };
  adminFetch();
  }, [navigate]);
  if(loading) return <Loading />;
  if (!admin) return <Navigate to="/" replace />;
  if (admin) return children;
  return null;
}
