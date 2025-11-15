import {useState, useContext} from "react";
import AuthContext from "./authcontext.js";
export default function Settings() {
    const { isAuth } = useContext(AuthContext);
  const [image, setImage] = useState("");
  async function postProfileImage(imageUrl) {
    const post = await fetch(
      process.env.REACT_APP_SERVER + "/api/users/createProfile",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl, email:isAuth.user}),
      }
    );
    const res = await post.json();
    const json = JSON.stringify(res);
    console.log(json);
    if (!post.ok) {
      return alert("error posting profile image, error: " + json);
    }
    alert(res.message);
  }

  return (
    <div id="settings-containing">
      <h1>Settings Page</h1>
      <div id="settings-container">
        <section className="settings-section" id="chat-commands">
          <h2>Chat Commands</h2>
          <ul>
            <li>image({"<Image Url>"}): creates an image</li>
            <li>link({"<Link Url>"}): creates a link</li>
          </ul>
        </section>
        <section className="settings-section" id="profile-settings">
          <h2>Profile Settings</h2>
          <label htmlFor="profile-image-input">Profile Image URL:</label>
          <input
            type="text"
            id="profile-image-input"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image URL"
          />
          <button id = "image-button" onClick={() => postProfileImage(image)}>
            Update Profile Image
          </button>
        </section>
      </div>
    </div>
  );
}
