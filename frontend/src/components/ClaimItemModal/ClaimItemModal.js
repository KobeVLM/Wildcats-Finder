import React, { useState } from "react";
import "./ClaimItemModal.css";

const ClaimItemModal = ({ item, onClose, onSubmit }) => {
  const [verificationAnswer, setVerificationAnswer] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  if (!item) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit({
      verificationAnswer,
      contactInfo,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Claim Item</h2>
        </div>
        <div className="modal-body">
          <p>Please verify your claim by answering the question below</p>
          <div className="item-info">
            <p>
              <strong>{item.itemTitle}</strong> - Lost at {item.location}
            </p>
          </div>
          <form>
            <div className="form-group">
              <label htmlFor="verification-question">
                Verification Question *
              </label>
              <p className="description">
                Describe a distinctive feature of the item that only the owner
                would know
              </p>
              <textarea
                id="verification-question"
                rows="4"
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="contact-info">Contact Information *</label>
              <input
                type="text"
                id="contact-info"
                placeholder="Phone number or Telegram/Viber username"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </div>
            <div className="alert">
              <p>
                The item reporter will receive your claim and contact you
                directly to verify ownership.
              </p>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClaimItemModal;
