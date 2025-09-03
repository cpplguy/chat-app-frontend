import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function Refresh() {
  const location = useLocation();
  /*
  useEffect(() => {
    if (!window.location.href.includes("reloaded=true")) {
      window.location.href +=
        (window.location.href.includes("?") ? "&" : "?") + "reloaded=true";
    }
  }, [location]);
  return null;
  */
}
