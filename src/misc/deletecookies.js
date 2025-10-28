  export async function deleteCookies() {
      const backendPath = `${/*
        !(process.env.REACT_APP_STATUS === "development")
          ? "/api/users/logout"
          : */process.env.REACT_APP_SERVER + "/api/users/logout"
      }`;
    try {
      const fetc = await fetch(backendPath, {
        method: "DELETE",
        credentials: "include",
      });
      if (!fetc.ok) {
        return alert("error occured. error: ", await fetc.json() || fetc.status);
      }
      window.location.reload();
    } catch (err) {
      alert("error occured, error: ", err);
    }
  }