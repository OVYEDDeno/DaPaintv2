import React, { useState } from "react";

export const LockInModal = ({ 
  showModal, 
  toggleModal, 
  match,
  onConfirm 
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onConfirm) {
        onConfirm(match);
      }
      setLoading(false);
      toggleModal();
    }, 1500);
  };

  if (!showModal || !match) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Lock In Confirmation</h2>
          <button className="close-btn" onClick={toggleModal}>×</button>
        </div>

        {/* Match Info */}
        <div className="modal-content">
          <div className="match-info-card">
            <div className="sport-badge">{match.sport}</div>
            <h3>{match.title}</h3>
            <div className="match-details">
              <div className="detail-item">
                <span className="icon">📍</span>
                <span>{match.location}</span>
              </div>
              <div className="detail-item">
                <span className="icon">🕐</span>
                <span>{match.time}</span>
              </div>
              <div className="detail-item">
                <span className="icon">💰</span>
                <span>${match.prize} Prize</span>
              </div>
            </div>
          </div>

          {/* Host Info */}
          <div className="host-section">
            <h4>You'll be competing against:</h4>
            <div className="host-card">
              <img 
                src={match.host.avatar} 
                alt={match.host.name}
                className="host-avatar"
              />
              <div className="host-info">
                <h5>{match.host.name}</h5>
                <div className="host-stats">
                  <span>🔥 {match.host.winStreak} Win Streak</span>
                  <span>⭐ {match.host.rating}/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Space */}
          <div className="ad-space">
            <div className="ad-banner">
              <img 
                src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Advertisement"
                className="ad-image"
              />
              <div className="ad-content">
                <h5>Nike Performance Gear</h5>
                <p>Get ready to dominate with professional sports equipment</p>
                <button className="ad-cta">Shop Now - 15% Off</button>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="confirmation-section">
            <h4>Are you sure you want to lock in?</h4>
            <p>Once confirmed, you'll be committed to this match. Make sure you can attend at the scheduled time.</p>
            
            <div className="action-buttons">
              <button 
                className="btn-cancel"
                onClick={toggleModal}
                disabled={loading}
              >
                No, Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Locking In..." : "Yes, Lock In!"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 15px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 25px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border-radius: 15px 15px 0 0;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: white;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .modal-content {
          padding: 25px;
        }

        .match-info-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          text-align: center;
        }

        .sport-badge {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 10px;
        }

        .match-info-card h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 18px;
        }

        .match-details {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #666;
          font-size: 14px;
        }

        .icon {
          font-size: 16px;
        }

        .host-section {
          margin-bottom: 20px;
        }

        .host-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .host-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #28a745;
          border-radius: 10px;
          background: #f8fff9;
        }

        .host-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #28a745;
        }

        .host-info h5 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 16px;
        }

        .host-stats {
          display: flex;
          gap: 15px;
        }

        .host-stats span {
          color: #666;
          font-size: 12px;
        }

        .ad-space {
          margin: 20px 0;
        }

        .ad-banner {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
          padding: 15px;
          color: white;
          gap: 15px;
        }

        .ad-image {
          width: 60px;
          height: 60px;
          border-radius: 8px;
          object-fit: cover;
        }

        .ad-content {
          flex: 1;
        }

        .ad-content h5 {
          margin: 0 0 5px 0;
          font-size: 14px;
        }

        .ad-content p {
          margin: 0 0 10px 0;
          font-size: 12px;
          opacity: 0.9;
        }

        .ad-cta {
          background: white;
          color: #667eea;
          border: none;
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: bold;
          cursor: pointer;
          font-size: 11px;
        }

        .ad-cta:hover {
          background: #f0f0f0;
        }

        .confirmation-section h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 16px;
          text-align: center;
        }

        .confirmation-section p {
          margin: 0 0 20px 0;
          color: #666;
          font-size: 14px;
          text-align: center;
          line-height: 1.4;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .btn-cancel {
          flex: 1;
          padding: 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #5a6268;
        }

        .btn-confirm {
          flex: 1;
          padding: 12px;
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }

        .btn-confirm:hover:not(:disabled) {
          background: linear-gradient(135deg, #20c997, #17a2b8);
        }

        .btn-cancel:disabled,
        .btn-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .modal-container {
            margin: 10px;
          }

          .match-details {
            flex-direction: column;
            gap: 10px;
          }

          .host-card {
            flex-direction: column;
            text-align: center;
          }

          .host-stats {
            justify-content: center;
          }

          .ad-banner {
            flex-direction: column;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};