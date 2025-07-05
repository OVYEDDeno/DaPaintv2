import React, { useState, useEffect } from "react";

export const MatchInterface = ({ 
  showMatchInterface, 
  toggleMatchInterface, 
  bearerToken,
  matchData = null,
  onMatchComplete 
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [matchResult, setMatchResult] = useState({
    winner: "",
    hostScore: "",
    foeScore: "",
    videoUrl: "",
    notes: ""
  });
  const [showResultForm, setShowResultForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Mock match data if none provided
  const defaultMatchData = {
    id: 1,
    sport: "Basketball",
    location: "Court 1",
    time: "2:30 PM",
    date: "Today",
    host: {
      id: 1,
      name: "Host Player",
      avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
      winStreak: 5,
      rating: 4.8
    },
    foe: {
      id: 2,
      name: "Foe Player", 
      avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png",
      winStreak: 3,
      rating: 4.6
    },
    rules: [
      "First to 21 points wins",
      "Must win by 2 points",
      "3-point line counts",
      "No fouling allowed"
    ],
    status: "confirmed"
  };

  const match = matchData || defaultMatchData;

  useEffect(() => {
    if (showMatchInterface) {
      // Load existing messages for this match
      loadMessages();
    }
  }, [showMatchInterface]);

  const loadMessages = async () => {
    try {
      // In real app, fetch messages from API
      const mockMessages = [
        {
          id: 1,
          senderId: match.host.id,
          senderName: match.host.name,
          message: "Ready to play! See you at the court.",
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: 2,
          senderId: match.foe.id,
          senderName: match.foe.name,
          message: "Let's do this! Good luck 🏀",
          timestamp: new Date(Date.now() - 120000).toISOString()
        }
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      
      // In real app, send to API
      const message = {
        id: messages.length + 1,
        senderId: 1, // Current user ID
        senderName: "You",
        message: newMessage,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");
    } catch (error) {
      setError("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    
    if (!matchResult.winner || !matchResult.hostScore || !matchResult.foeScore) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // In real app, submit to API
      const response = await fetch('/api/matches/submit-result', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId: match.id,
          ...matchResult
        })
      });

      if (response.ok) {
        setSuccess("Match result submitted successfully!");
        setTimeout(() => {
          if (onMatchComplete) {
            onMatchComplete(matchResult);
          }
          toggleMatchInterface();
        }, 2000);
      } else {
        setError("Failed to submit match result");
      }
    } catch (error) {
      console.error('Error submitting result:', error);
      setError("Error submitting match result");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!showMatchInterface) return null;

  return (
    <div className="match-interface-overlay">
      <div className="match-interface-container">
        {/* Header */}
        <div className="match-header">
          <button 
            className="close-btn" 
            onClick={toggleMatchInterface}
          >
            ←
          </button>
          <h2>Match Details</h2>
          <div className="match-status">
            <span className={`status-badge ${match.status}`}>
              {match.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Match Info */}
        <div className="match-info-section">
          <div className="match-details-card">
            <h3>{match.sport} Match</h3>
            <div className="match-meta">
              <span>📍 {match.location}</span>
              <span>🕐 {match.time}</span>
              <span>📅 {match.date}</span>
            </div>
          </div>

          {/* Players */}
          <div className="players-section">
            <div className="player-card host">
              <img src={match.host.avatar} alt={match.host.name} />
              <div className="player-info">
                <h4>{match.host.name}</h4>
                <div className="player-stats">
                  <span>🔥 {match.host.winStreak} streak</span>
                  <span>⭐ {match.host.rating}/5</span>
                </div>
              </div>
              <div className="player-badge">HOST</div>
            </div>

            <div className="vs-divider">VS</div>

            <div className="player-card foe">
              <img src={match.foe.avatar} alt={match.foe.name} />
              <div className="player-info">
                <h4>{match.foe.name}</h4>
                <div className="player-stats">
                  <span>🔥 {match.foe.winStreak} streak</span>
                  <span>⭐ {match.foe.rating}/5</span>
                </div>
              </div>
              <div className="player-badge">FOE</div>
            </div>
          </div>

          {/* Rules */}
          <div className="rules-section">
            <h4>Match Rules</h4>
            <ul>
              {match.rules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat Section */}
        <div className="chat-section">
          <h4>Match Chat</h4>
          <div className="messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.senderName === 'You' ? 'own' : 'other'}`}>
                <div className="message-header">
                  <span className="sender">{msg.senderName}</span>
                  <span className="time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">{msg.message}</div>
              </div>
            ))}
          </div>
          
          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="message-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !newMessage.trim()}>
              Send
            </button>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {!showResultForm ? (
            <>
              <button 
                className="btn-secondary"
                onClick={() => setShowResultForm(true)}
              >
                Submit Match Result
              </button>
              <button className="btn-danger">
                Report Issue
              </button>
            </>
          ) : (
            <button 
              className="btn-secondary"
              onClick={() => setShowResultForm(false)}
            >
              Cancel Result Submission
            </button>
          )}
        </div>

        {/* Result Submission Form */}
        {showResultForm && (
          <div className="result-form-section">
            <h4>Submit Match Result</h4>
            
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            
            {success && (
              <div className="alert alert-success">{success}</div>
            )}

            <form onSubmit={handleResultSubmit}>
              <div className="form-group">
                <label>Winner *</label>
                <select
                  value={matchResult.winner}
                  onChange={(e) => setMatchResult(prev => ({...prev, winner: e.target.value}))}
                  required
                >
                  <option value="">Select Winner</option>
                  <option value="host">{match.host.name} (Host)</option>
                  <option value="foe">{match.foe.name} (Foe)</option>
                </select>
              </div>

              <div className="score-inputs">
                <div className="form-group">
                  <label>{match.host.name} Score *</label>
                  <input
                    type="number"
                    value={matchResult.hostScore}
                    onChange={(e) => setMatchResult(prev => ({...prev, hostScore: e.target.value}))}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{match.foe.name} Score *</label>
                  <input
                    type="number"
                    value={matchResult.foeScore}
                    onChange={(e) => setMatchResult(prev => ({...prev, foeScore: e.target.value}))}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Match Video URL *</label>
                <input
                  type="url"
                  value={matchResult.videoUrl}
                  onChange={(e) => setMatchResult(prev => ({...prev, videoUrl: e.target.value}))}
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
                <small>Upload your match video to YouTube/TikTok and paste the link here</small>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  value={matchResult.notes}
                  onChange={(e) => setMatchResult(prev => ({...prev, notes: e.target.value}))}
                  placeholder="Any additional details about the match..."
                  rows="3"
                />
              </div>

              <button 
                type="submit" 
                className="submit-result-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Result"}
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        .match-interface-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .match-interface-container {
          background: white;
          border-radius: 15px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .match-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 25px;
          border-bottom: 1px solid #eee;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
        }

        .match-header h2 {
          margin: 0;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #333;
          padding: 5px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(0,0,0,0.1);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }

        .status-badge.confirmed {
          background: #4CAF50;
          color: white;
        }

        .match-info-section {
          padding: 25px;
        }

        .match-details-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .match-details-card h3 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .match-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .match-meta span {
          color: #666;
          font-size: 14px;
        }

        .players-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .player-card {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 10px;
          position: relative;
        }

        .player-card.host {
          border-color: #ffd700;
        }

        .player-card.foe {
          border-color: #ff6b6b;
        }

        .player-card img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }

        .player-info h4 {
          margin: 0 0 5px 0;
          color: #333;
        }

        .player-stats {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: #666;
        }

        .player-badge {
          position: absolute;
          top: -8px;
          right: 10px;
          background: #333;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
        }

        .vs-divider {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          flex-shrink: 0;
        }

        .rules-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .rules-section h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .rules-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .rules-section li {
          margin-bottom: 8px;
          color: #666;
        }

        .chat-section {
          padding: 0 25px 25px;
          border-top: 1px solid #eee;
          margin-top: 20px;
          padding-top: 25px;
        }

        .chat-section h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .messages-container {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 15px;
          background: #fafafa;
        }

        .message {
          margin-bottom: 15px;
        }

        .message.own {
          text-align: right;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 12px;
          color: #666;
        }

        .message.own .message-header {
          flex-direction: row-reverse;
        }

        .message-content {
          background: white;
          padding: 10px;
          border-radius: 10px;
          display: inline-block;
          max-width: 70%;
        }

        .message.own .message-content {
          background: #ffd700;
          color: #333;
        }

        .message-form {
          display: flex;
          gap: 10px;
        }

        .message-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
        }

        .message-input:focus {
          border-color: #ffd700;
        }

        .message-form button {
          padding: 10px 20px;
          background: #ffd700;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
        }

        .message-form button:hover {
          background: #ffed4e;
        }

        .message-form button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
          padding: 0 25px 25px;
        }

        .btn-secondary {
          flex: 1;
          padding: 12px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-danger {
          flex: 1;
          padding: 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .result-form-section {
          padding: 25px;
          border-top: 1px solid #eee;
          background: #f8f9fa;
        }

        .result-form-section h4 {
          margin: 0 0 20px 0;
          color: #333;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ffd700;
        }

        .form-group small {
          display: block;
          margin-top: 5px;
          color: #666;
          font-size: 12px;
        }

        .score-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .submit-result-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          color: #333;
          cursor: pointer;
        }

        .submit-result-btn:hover {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
        }

        .submit-result-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .alert {
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 15px;
        }

        .alert-danger {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        @media (max-width: 768px) {
          .match-interface-overlay {
            padding: 10px;
          }

          .players-section {
            flex-direction: column;
            gap: 15px;
          }

          .vs-divider {
            transform: rotate(90deg);
          }

          .score-inputs {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .match-meta {
            flex-direction: column;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};