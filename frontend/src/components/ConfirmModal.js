import React from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

// Usage:
// const [showConfirm, setShowConfirm] = useState(false);
// <ConfirmModal
//   isOpen={showConfirm}
//   title="Delete Item"
//   message="Are you sure you want to delete this item?"
//   onConfirm={() => {
//     handleDelete(itemId);
//     setShowConfirm(false);
//   }}
//   onCancel={() => setShowConfirm(false)}
// />