import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
export default function AdminDashboard() {
  const backendPath = `${process.env.REACT_APP_SERVER + "/api/admin"}`;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchData = await fetch(backendPath + "/users", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (fetchData.status === 403 || fetchData.status === 401) return navigate("/", { replace: true });
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
    const confirmDel = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDel) return;
    try {
      const response = await fetch(backendPath + "/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
        credentials: "include",
      });
      const jsonRes = await response.json();
      if (response.ok) {
        setUsers((usrs) => usrs.filter((user) => user._id !== userId));
        alert("User deleted");
      } else {
        alert(`Error deleting user: ${jsonRes.error}`);
      }
    } catch (err) {
      alert(`An error occurred: ${err.message}`);
    }
  }

  async function banUser(userId, path, method) {
    const messagePrompt = prompt("Please enter a reason for banning the user (add :unban to unban):");
    if (!messagePrompt) { alert("Please enter a reason."); return; }
    const banFetch = await fetch(backendPath + path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message: messagePrompt }),
      credentials: "include",
    });
    const jsonRes = await banFetch.json();
    if (banFetch.ok) {
      setUsers(users.map((user) => user._id === userId ? { ...user, banned: true, bannedMessage: messagePrompt } : user));
      alert("User banned successfully.");
    } else if (banFetch.status === 403 || banFetch.status === 401) {
      return navigate("/", { replace: true });
    } else {
      alert(`Error banning user: ${jsonRes.error}`);
    }
  }

  async function setRank(email) {
    const rank = prompt("Enter rank (owner, admin, moderator, helper, vip, member):");
    if (!rank) return;
    const res = await fetch(backendPath + "/users/rank", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, rank }),
      credentials: "include",
    });
    const json = await res.json();
    if (res.ok) {
      setUsers(users.map((u) => u.email === email ? { ...u, rank } : u));
      alert(`Rank set to ${rank}!`);
    } else {
      alert(`Error: ${json.error}`);
    }
  }

  return (
    <>
      <div id="dashboard">
        <header id="admin-header">
          <h1>Admin Dashboard</h1>
          <div id="admin-button-container">
            <button onClick={() => navigate("/admin/rawUserData")}>Get Raw User Data</button>
            <button onClick={() => navigate("/admin/rawMessageData")}>Get Raw Message Data</button>
          </div>
        </header>
        <table style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <thead>
            <tr>
              <th>Email/Username</th>
              <th>Banned Status</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="table-name">{user.email}</td>
                <td className="table-banned">
                  Banned: <span style={{ fontWeight: "bold" }}>{user.banned ? "Reason: " + user.bannedReason : "not banned"}</span>
                </td>
                <td className="table-rank">
                  Rank: <span style={{ fontWeight: "bold" }}>{user.rank || "member"}</span>
                </td>
                <td className="admin-commands">
                  {(![...JSON.parse(process.env.REACT_APP_ADMINS)].includes(user.email)) && (
                    <>
                      <button className="delete user" onClick={() => deleteUser(user._id)}>Delete User</button>
                      <button className="ban user" onClick={() => banUser(user._id, "/users/ban", "PATCH")}>Ban User</button>
                      <button className="ipban user" disabled={user.ip.length >= 60} onClick={() => banUser(user._id, "/users/ipban", "POST")}>IP Ban User</button>
                    </>
                  )}
                  <button className="rank user" onClick={() => setRank(user.email)}>Set Rank</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
