import React from 'react'
import "./styles/Popup.css"
import { AiOutlineClose } from "react-icons/ai";

function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn" onClick={() => props.setTrigger(false)}><AiOutlineClose></AiOutlineClose></button>
        <button className="cancel-btn" onClick={() => props.setTrigger(false)}>Annuler</button>
        { props.children } 
      </div>  
    </div>
  ) : "";
}

export default Popup
