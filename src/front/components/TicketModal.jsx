import React, { useState } from "react";

export const TicketModal = ({ 
  showModal, 
  toggleModal, 
  match,
  onPurchase 
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalPrice = (parseFloat(match?.ticketPrice || 0) * ticketQuantity).toFixed(2);

  const handlePurchase = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onPurchase) {
        onPurchase({
          match,
          quantity: ticketQuantity,
          totalPrice: totalPrice
        });
      }
      setLoading(false);
      toggleModal();
    }, 2000);
  };

  if (!showModal || !match) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <h2>Buy Match Tickets</h2>
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
                <span className="icon">🎫</span>
                <span>${match.ticketPrice}/ticket</span>
              </div>
            </div>
          </div>

          {/* Players */}
          <div className="players-section">
            <h4>Match Competitors:</h4>
            <div className="players-container">
              <div className="player-card">
                <img 
                  src={match.host.avatar} 
                  alt={match.host.name}
                  className="player-avatar"
                />
                <div className="player-info">
                  <h5>{match.host.name}</h5>
                  <div className="player-stats">
                    <span>🔥 {match.host.winStreak}</span>
                    <span>⭐ {match.host.rating}/5</span>
                  </div>
                </div>
                <div className="player-badge">HOST</div>
              </div>

              <div className="vs-divider">VS</div>

              <div className="player-card">
                <img 
                  src={match.foe.avatar} 
                  alt={match.foe.name}
                  className="player-avatar"
                />
                <div className="player-info">
                  <h5>{match.foe.name}</h5>
                  <div className="player-stats">
                    <span>🔥 {match.foe.winStreak}</span>
                    <span>⭐ {match.foe.rating}/5</span>
                  </div>
                </div>
                <div className="player-badge">FOE</div>
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
                <h5>Premium Sports Streaming</h5>
                <p>Watch exclusive matches live with HD quality</p>
                <button className="ad-cta">Subscribe - 30% Off</button>
              </div>
            </div>
          </div>

          {/* Ticket Purchase */}
          <div className="purchase-section">
            <h4>Purchase Tickets</h4>
            
            <div className="ticket-selector">
              <label>Number of Tickets:</label>
              <div className="quantity-controls">
                <button 
                  className="qty-btn"
                  onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                  disabled={ticketQuantity <= 1}
                >
                  -
                </button>
                <span className="quantity">{ticketQuantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                  disabled={ticketQuantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Ticket Price:</span>
                <span>${match.ticketPrice}</span>
              </div>
              <div className="price-row">
                <span>Quantity:</span>
                <span>{ticketQuantity}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <div className="ticket-benefits">
              <h5>What's Included:</h5>
              <ul>
                <li>✅ Live match viewing access</li>
                <li>✅ Real-time chat with other viewers</li>
                <li>✅ Post-match highlights</li>
                <li>✅ Player statistics and analytics</li>
              </ul>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-cancel"
                onClick={toggleModal}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="btn-purchase"
                onClick={handlePurchase}
                disabled={loading}
              >
                {loading ? "Processing..." : `Buy ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''} - $${totalPrice}`}
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
          max-width: 600px;
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
          background: linear-gradient(135deg, #6f42c1, #8e44ad);
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
          background: linear-gradient(135deg, #6f42c1, #8e44ad);
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

        .players-section {
          margin-bottom: 20px;
        }

        .players-section h4 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .players-container {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .player-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border: 2px solid #6f42c1;
          border-radius: 10px;
          background: #f8f6ff;
          position: relative;
        }

        .player-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6f42c1;
        }

        .player-info h5 {
          margin: 0 0 5px 0;
          color: #333;
          font-size: 14px;
        }

        .player-stats {
          display: flex;
          gap: 10px;
        }

        .player-stats span {
          color: #666;
          font-size: 11px;
        }

        .player-badge {
          position: absolute;
          top: -8px;
          right: 10px;
          background: #6f42c1;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }

        .vs-divider {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          flex-shrink: 0;
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

        .purchase-section h4 {
          margin: 0 0 20px 0;
          color: #333;
          font-size: 16px;
        }

        .ticket-selector {
          margin-bottom: 20px;
        }

        .ticket-selector label {
          display: block;
          margin-bottom: 10px;
          font-weight: bold;
          color: #333;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 15px;
          justify-content: center;
        }

        .qty-btn {
          width: 40px;
          height: 40px;
          border: 2px solid #6f42c1;
          background: white;
          color: #6f42c1;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn:hover:not(:disabled) {
          background: #6f42c1;
          color: white;
        }

        .qty-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .quantity {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          min-width: 40px;
          text-align: center;
        }

        .price-breakdown {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          color: #666;
        }

        .price-row.total {
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 8px;
          font-weight: bold;
          color: #333;
          font-size: 16px;
        }

        .ticket-benefits {
          margin-bottom: 25px;
        }

        .ticket-benefits h5 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 14px;
        }

        .ticket-benefits ul {
          margin: 0;
          padding-left: 0;
          list-style: none;
        }

        .ticket-benefits li {
          margin-bottom: 5px;
          color: #666;
          font-size: 13px;
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

        .btn-purchase {
          flex: 2;
          padding: 12px;
          background: linear-gradient(135deg, #6f42c1, #8e44ad);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }

        .btn-purchase:hover:not(:disabled) {
          background: linear-gradient(135deg, #8e44ad, #9b59b6);
        }

        .btn-cancel:disabled,
        .btn-purchase:disabled {
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

          .players-container {
            flex-direction: column;
            gap: 10px;
          }

          .vs-divider {
            transform: rotate(90deg);
          }

          .ad-banner {
            flex-direction: column;
            text-align: center;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn-purchase {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
};