import React from "react";

export const HostMatchCard = ({ 
  match, 
  onLockIn, 
  onBuyTicket,
  currentUser 
}) => {
  const handleLockIn = () => {
    if (onLockIn) {
      onLockIn(match);
    }
  };

  const handleBuyTicket = () => {
    if (onBuyTicket) {
      onBuyTicket(match);
    }
  };

  // Card Type 1: Host looking for foes
  if (match.type === 'looking-for-foe') {
    return (
      <div className="host-match-card looking-for-foe">
        <div className="match-status-badge">Looking for Foe</div>
        
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
            position: relative;
          }

          .host-match-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            border-color: #ffed4e;
          }

          .looking-for-foe {
            border-color: #28a745;
          }

          .looking-for-foe:hover {
            border-color: #20c997;
          }

          .match-status-badge {
            position: absolute;
            top: -8px;
            left: 15px;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
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
            background: linear-gradient(135deg, #28a745, #20c997);
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
            background: linear-gradient(135deg, #20c997, #17a2b8);
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
  }

  // Card Type 2: Host and foe selling tickets
  return (
    <div className="host-match-card selling-tickets">
      <div className="match-status-badge">Selling Tickets</div>
      
      <div className="match-info">
        <div className="sport-badge">{match.sport}</div>
        <div className="match-details">
          <h4>{match.title}</h4>
          <div className="match-meta">
            <span>📍 {match.location}</span>
            <span>🕐 {match.time}</span>
            <span>🎫 ${match.ticketPrice}/ticket</span>
          </div>
        </div>
      </div>
      
      <div className="players-info">
        <div className="player-mini">
          <img src={match.host.avatar} alt={match.host.name} className="player-avatar" />
          <span className="player-name">{match.host.name}</span>
        </div>
        <div className="vs-text">VS</div>
        <div className="player-mini">
          <img src={match.foe.avatar} alt={match.foe.name} className="player-avatar" />
          <span className="player-name">{match.foe.name}</span>
        </div>
      </div>

      <button 
        className="buy-ticket-btn"
        onClick={handleBuyTicket}
      >
        Buy Ticket
      </button>

      <style jsx>{`
        .host-match-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255, 255, 255, 0.95);
          border: 2px solid #6f42c1;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          min-width: 400px;
          flex-shrink: 0;
          position: relative;
        }

        .host-match-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border-color: #8e44ad;
        }

        .selling-tickets {
          border-color: #6f42c1;
        }

        .selling-tickets:hover {
          border-color: #8e44ad;
        }

        .match-status-badge {
          position: absolute;
          top: -8px;
          left: 15px;
          background: #6f42c1;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .match-info {
          flex: 1;
          min-width: 0;
        }

        .sport-badge {
          background: linear-gradient(135deg, #6f42c1, #8e44ad);
          color: white;
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

        .players-info {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .player-mini {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .player-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #6f42c1;
        }

        .player-name {
          font-size: 10px;
          font-weight: bold;
          color: #333;
          text-align: center;
        }

        .vs-text {
          font-size: 12px;
          font-weight: bold;
          color: #666;
          margin: 0 5px;
        }

        .buy-ticket-btn {
          background: linear-gradient(135deg, #6f42c1, #8e44ad);
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

        .buy-ticket-btn:hover {
          background: linear-gradient(135deg, #8e44ad, #9b59b6);
          transform: scale(1.05);
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

          .player-avatar {
            width: 30px;
            height: 30px;
          }

          .player-name {
            font-size: 9px;
          }

          .vs-text {
            font-size: 10px;
          }

          .buy-ticket-btn {
            padding: 10px 16px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};