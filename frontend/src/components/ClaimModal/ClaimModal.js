import React, { useState } from 'react';
import './ClaimModal.css';

function ClaimModal({ isOpen, onClose, onSubmit, item }) {
  const [verificationAnswer, setVerificationAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!verificationAnswer.trim()) {
      alert('Please provide verification details');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(verificationAnswer);
      setVerificationAnswer('');
      onClose();
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.className === 'claim-modal-backdrop') {
      onClose();
    }
  };

  return (
    <div className="claim-modal-backdrop" onClick={handleBackdropClick}>
      <div className="claim-modal">
        <div className="claim-modal-header">
          <h2>🙋 Claim This Item</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="claim-modal-item-info">
          {item.imageUrl && (
            <img 
              src={`http://localhost:8080${item.imageUrl}`}
              alt={item.itemTitle}
              className="claim-item-thumbnail"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <div className="claim-item-details">
            <h3>{item.itemTitle}</h3>
            <p className="item-location">📍 {item.location}</p>
            <span className={`status-badge ${item.status?.toLowerCase()}`}>
              {item.status}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="claim-form">
          <div className="form-group">
            <label htmlFor="verification">
              <strong>Verification Details</strong>
              <span className="required">*</span>
            </label>
            <p className="form-hint">
              Please provide details to prove this item belongs to you. 
              Describe unique features, where you lost it, or any identifying marks.
            </p>
            <textarea
              id="verification"
              value={verificationAnswer}
              onChange={(e) => setVerificationAnswer(e.target.value)}
              placeholder="Example: This is my blue iPhone 14 with a cracked screen protector. I lost it in the cafeteria on Monday. It has a photo of my dog as the wallpaper."
              rows={5}
              required
            />
          </div>

          <div className="claim-modal-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : '✓ Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClaimModal;
