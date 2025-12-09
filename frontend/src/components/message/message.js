// message.js - Updated version
import React, { useEffect, useState } from "react";
import "./message.css";

function Message({ 
  text, 
  title = "", 
  type = "info", 
  duration = 5000, 
  onClose,
  showCloseButton = true 
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!text) return;

    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 5000);
    }, duration);

    return () => clearTimeout(timer);
  }, [text, duration, onClose]);

  if (!text) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 5000);
  };

  return (
    <div className={`message ${type} ${visible ? "show" : "hide"}`}>
      <div className="message-content">
        {title && <div className="message-title">{title}</div>}
        <div className="message-text">{text}</div>
      </div>
      {showCloseButton && (
        <button className="message-close" onClick={handleClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default Message;