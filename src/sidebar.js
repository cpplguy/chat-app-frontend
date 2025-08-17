import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
function RoomIdForm({ roomInput, setRoomInput, formOpened, setFormOpened }) {
    
  const navigate = useNavigate();
  function submitHandler(e) {
    e.preventDefault();
    navigate("/chat/" + String(roomInput).trim(), { replace: true });
    setRoomInput("")
  }
  function onKeyDownHandler(e){
    if(e.key === "Enter"){
        submitHandler(e)
    } 
  }
  return (
    <div id="room-container" className={formOpened ? "opened" : ""}>
      <button id="close" onClick={() => setFormOpened(false)}>
        X
      </button>
      <form id="join-room-form" onSubmit={submitHandler}>
        <h5>Type in the chat-room you would like to enter. (Default chat-room is Main.)</h5>
        <label>
          Room Name:
          <div style = {{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <input
          onKeyDown={onKeyDownHandler}
            value={roomInput}
            onChange={(e) => {
              setRoomInput(e.target.value);
            }}
            placeholder="Enter room name..."
          />
          <button
            className="clear"
            onClick={(e) => {
              e.preventDefault();
              setRoomInput("");
            }}
          >
            X
          </button>
          </div>
        </label>
        <button type="submit">Join Room</button>
      </form>
    </div>
  );
}
export default function SideBar({ usernames }) {
  const [roomInput, setRoomInput] = useState("");
  const [formOpened, setFormOpened] = useState(false);
  function copyToClipboard(usr) {
    navigator.clipboard
      .writeText(usr)
      .then(() => alert("copied to clipboard"))
      .catch((err) => console.error("failed to copy. Error: ", err));
  }
  const [peopleOnlineSection, setPeopleOnlineSection] = useState(false);

  const [sideBar, setSideBar] = useState(false);
  return (
    <>
      <section id="side">
        <div id="button-container">
          <button
            id="sidebar-button"
            className={sideBar ? "displayed" : "not-displayed"}
            onClick={() => setSideBar((prev) => !prev)}
          >
            <h2>»</h2>
          </button>
        </div>
        <aside className={sideBar ? "displayed" : "not-displayed"}>
          <div id="people">
            <div
              id="section-heading"
              onClick={() => {
                setPeopleOnlineSection(() => !peopleOnlineSection);
              }}
            >
              People in Room
              <span
                id="arrow"
                className={peopleOnlineSection ? "section-displayed" : ""}
              >
                ⌄
              </span>
            </div>
            <br />
            <div
              className={
                "section " + (peopleOnlineSection ? "section-displayed" : "")
              }
            >
              {usernames &&
                usernames.map((usr, idx) => {
                  return (
                    <div className = "user-container" key={idx}>
                      <div className="name" title={usr}>
                        {usr.length < 12 ? usr : usr.slice(0, 8) + "..."}
                      </div>
                      <div className="copy-container">
                        <button
                          className="copy"
                          onClick={() => copyToClipboard(usr)}
                        >
                          <img src="/image.png" alt="copy" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <button id="open-form" onClick={() => setFormOpened(true)}>
            Join a chat room
          </button>
        </aside>
      </section>
      <RoomIdForm
        roomInput={roomInput}
        setRoomInput={setRoomInput}
        formOpened={formOpened}
        setFormOpened={setFormOpened}
      />
    </>
  );
}
