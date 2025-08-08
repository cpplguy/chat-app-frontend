import { useEffect } from "react";
export default function Refresh() {
  useEffect(() => {
    if(!window.location.href.includes("reloaded=true")){
      window.location.href+=(window.location.href.includes("?") ? "&" : "?") + "reloaded=true"
    }
  }, []);
  return null;
}
