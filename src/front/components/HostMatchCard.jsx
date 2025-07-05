import React from "react";

export const HostMatchCard = ({ 
  match, 
  onLockIn, 
  currentUser 
}) => {
  const handleLockIn = () => {
    if (onLockIn) {
      onLockIn(match);
    }
  };

  return (
    <div className="host-match-card">
      <div className="match-info">
        <div className="sport-badge">{match.sport}</div>
        <div className="match-details">
          <h4>{match.title}</h4>
          <div className="match-meta">
            <span>📍 {match.location}</span>
            <span>🕐 {match.time}</span>
            <span>💰 ${match.prize}</span>
          </div>
        </div>
      </div>
      
      <div className="host-info">
        <img 
          src={match.host.avatar} 
          alt={match.host.name}
          className="host-avatar"
        />
        <div className="host-details">
          <span className="host-name">{match.host.name}</span>
          <div className="host-stats">
            <span>🔥 {match.host.winStreak}</span>
            <span>⭐ {match.host.rating}/5</span>
          </div>
        </div>
      </div>

      <button 
        className="lock-in-btn"
        onClick={handleLockIn}
        disabled={match.host.id === currentUser?.id}
      >
        {match.host.id === currentUser?.id ? "Your Match" : "Lock In"}
      </button>

      <style jsx>{`
        .host-match-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #ffd700;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          min-width: 400px;
          flex-shrink: 0;
        }

        .host-match-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border-color: #ffed4e;
        }

        .match-info {
          flex: 1;
          min-width: 0;
        }

        .sport-badge {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #333;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-bottom: 8px;
        }

        .match-details h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 16px;
          font-weight: bold;
        }

        .match-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .match-meta span {
          color: #666;
          font-size: 12px;
          white-space: nowrap;
        }

        .host-info {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .host-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ffd700;
        }

        .host-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .host-name {
          font-weight: bold;
          color: #333;
          font-size: 14px;
        }

        .host-stats {
          display: flex;
          gap: 8px;
        }

        .host-stats span {
          color: #666;
          font-size: 11px;
        }

        .lock-in-btn {
          background: linear-gradient(135deg, #ff6b6b, #ee5a52);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          flex-shrink: 0;
          text-transform: uppercase;
        }

        .lock-in-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ee5a52, #dc3545);
          transform: scale(1.05);
        }

        .lock-in-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .host-match-card {
            min-width: 300px;
            padding: 12px;
            gap: 10px;
          }

          .match-details h4 {
            font-size: 14px;
          }

          .match-meta {
            gap: 8px;
          }

          .match-meta span {
            font-size: 11px;
          }

          .host-avatar {
            width: 40px;
            height: 40px;
          }

          .host-name {
            font-size: 12px;
          }

          .host-stats span {
            font-size: 10px;
          }

          .lock-in-btn {
            padding: 10px 16px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};