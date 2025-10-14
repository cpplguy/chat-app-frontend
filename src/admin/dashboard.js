import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
export default function AdminDashboard() {
  const backendPath = `${/*
    !(process.env.REACT_APP_STATUS === "development")
      ? "/api/admin"
      : */ process.env.REACT_APP_SERVER + "/api/admin"
  }`;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
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
          setUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users: ", err);
      }
    };
    fetchUsers();
  }, [navigate, backendPath]);
  async function deleteUser(userId) {
    try {
      const response = await fetch(backendPath + "/users/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
        credentials: "include",
      });
      const jsonRes = await response.json();
      if (response.ok) {
        setUsers((usrs) => usrs.filter((user) => user._id !== userId));
        console.log("User deleted successfully.");
        alert("user deleted");
      } else {
        console.error("Error deleting user: ", jsonRes);
        alert(`Error deleting user: ${jsonRes.error}`);
      }
    } catch (err) {
      console.error("Error deleting user: ", err);
      alert(`An error occurred while deleting the user: ${err.message}`);
    }
  }
  async function banUser(userId, path, method) {
    const messagePrompt = prompt(
      "Please enter a reason for banning the user (add :unban to unban a user):"
    );
    if (!messagePrompt) {
      alert("Please enter a reason.");
      return;
    }
    const banFetch = await fetch(backendPath + path, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId, message: messagePrompt }),
      credentials: "include",
    });
    const jsonRes = await banFetch.json();
    if (banFetch.ok) {
      setUsers(
        users.map(
          (user) =>
            user._id === userId && {
              ...user,
              banned: true,
              bannedMessage: messagePrompt,
            }
        )
      );
      console.log("User banned successfully.");
      alert("User banned successfully.");
    } else if (banFetch.status === 403 || banFetch.status === 401) {
      return navigate("/", { replace: true });
    } else if (banFetch.status === 404 || banFetch.status === 400) {
      console.error("Error banning user: ", jsonRes);
      alert(`Error banning user: ${jsonRes.error}`);
    }
  }

  return (
    <>
      <div id="dashboard">
        <header id="admin-header">
          <h1>Admin Dashboard</h1>
        </header>
        <table
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <thead>
            <tr>
              <th>Email/Username</th>
              <th>Banned Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <td className="table-name">{user.email}</td>
                  <td className = "table-banned">
                    Banned:{" "}
                    <span style={{ fontWeight: "bold" }}>
                      {user.banned
                        ? "Reason: " + user.bannedReason
                        : "not banned"}
                    </span>
                  </td>
                  <td className="admin-commands">
                    {user.email !== "admin@admin.com" && (
                      <>
                        <button
                          className="delete user"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete User
                        </button>
                        <button
                          className="ban user"
                          onClick={() =>
                            banUser(user._id, "/users/ban", "PATCH")
                          }
                        >
                          Ban User
                        </button>
                         {/*ip ban no work cuz erverybody share same ip */}
                        <button
                          className="ipban user"
                          disabled={true}
                         
                          onClick={() =>
                            banUser(user._id, "/users/ipban", "POST")
                          }
                        >
                          IP Ban User
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
