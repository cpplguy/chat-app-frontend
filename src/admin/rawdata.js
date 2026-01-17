import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const backendPath = `${
  /*
    !(process.env.REACT_APP_STATUS === "development")
      ? "/api/admin"
      : */ process.env.REACT_APP_SERVER + "/api/admin"
}`;

function RawDataPage({ rawData }) {
  return (
    <div style={{ backgroundColor: "black" }}>
      <h1>Raw Data</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          color: "white",
        }}
      >
        {JSON.stringify(rawData, null, 2)}
      </pre>
    </div>
  );
}
export function RawUserPage() {
  const navigate = useNavigate();
  const [rawUserData, setRawUserData] = useState({});
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchData = await fetch(backendPath + "/users", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (fetchData.status === 403 || fetchData.status === 401) {
          return navigate("/", { replace: true });
        }
        if (fetchData.ok) {
          const data = await fetchData.json();
          setRawUserData(data);
        }
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };
    fetchUsers();
  }, [navigate, backendPath]);
  return <RawDataPage rawData={rawUserData} />;
}
export function RawMessagePage() {
  const navigate = useNavigate();
  const [rawMessageData, setRawMessageData] = useState({});
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchData = await fetch(backendPath + "/messages", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (fetchData.status === 403 || fetchData.status === 401) {
          return navigate("/", { replace: true });
        }
        if (fetchData.ok) {
          const data = await fetchData.json();
          setRawMessageData(data);
        }
      } catch (err) {
        console.error("Error fetching messages: ", err);
      }
    };
    fetchMessages();
  }, [navigate, backendPath]);
  return <RawDataPage rawData={rawMessageData} />;
}
