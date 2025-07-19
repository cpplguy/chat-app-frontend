import React from "react";
import { useNavigate } from "react-router-dom";
export default function NotFound(){
    const Navigate = useNavigate();
    return (
        <div id = "not-found-container">
            <div id = "circle">
                <p>X</p>
            </div>
            <h1>Sorry, the page you are looking for is not found.</h1>
            <button id = "not-found" onClick = {() => Navigate("/", {replace: true})}>Click here to go back to login or chat</button>
        </div>
    )
}