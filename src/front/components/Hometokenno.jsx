import React from "react";
import { Footer } from "./Footer";
import { DaPaintLockIn } from "./DaPaintLockIn";
import { HostMatchScroller } from "./HostMatchScroller";

export const Hometokenno = ({ 
  toggleAuth, 
  toggleDaPaintCreate, 
  toggleMatchInterface,
  toggleLockInModal,
  toggleTicketModal,
  isAuthenticated,
  bearerToken,
  currentUser
}) => {
  
  const handleMatchSelect = (match) => {
    // When a user locks into a match looking for foe, show lock in modal
    console.log('User wants to lock into match:', match);
    toggleLockInModal(match);
  };

  const handleTicketPurchase = (match) => {
    // When a user wants to buy tickets, show ticket modal
    console.log('User wants to buy tickets for match:', match);
    toggleTicketModal(match);
  };

  return (
    <main className="m-3">
      {/* Host Match Scroller - Only show when authenticated */}
      {isAuthenticated && (
        <HostMatchScroller 
          onMatchSelect={handleMatchSelect}
          onTicketPurchase={handleTicketPurchase}
          currentUser={currentUser}
          bearerToken={bearerToken}
        />
      )}

      {/* Hero Section */}
          {!isAuthenticated && (
  <section className="hero-section">
    <h1 className="heroh1 text-center" style={{ marginTop: "168px" }}>
      "Winners Don't Just Play…They Profit!"
    </h1>

    <div className="text-center" style={{ color: "#ffffff", fontSize: "17px" }}>
      <p className="mb-3">
        "Welcome to DaPaint.org—the FREE intuitive platform where players get paid what they're worth."
      </p>
      <button
        className="golden-button rounded-pill w-50 mt-2"
        onClick={toggleAuth}
      >
        <span className="golden-text" style={{ fontSize: "17px" }}>
          Join The Movement
        </span>
      </button>
    </div>
  </section>
)}

{isAuthenticated && (
  <>
    <div className="d-flex gap-3 justify-content-center">
      <button
        className="golden-button rounded-pill"
        onClick={toggleDaPaintCreate}
        style={{ fontSize: "17px", padding: "10px 20px" }}
      >
        <span className="golden-text">Create a DaPaint</span>
      </button>
      <button
        className="btn btn-outline-light rounded-pill"
        onClick={toggleMatchInterface}
        style={{ fontSize: "17px", padding: "10px 20px" }}
      >
        View Active Match
      </button>
    </div>
  </>
)}


      {/* Main Content Section */}
      <section className="container text-black" style={{ marginTop: "168px" }}>
        {isAuthenticated ? (
          // Chat Section with Ad Space for Authenticated Users          <div className="chat-dashboard">
           

            {/* Ad Space */}
            <div className="ad-space-section mb-4">
              <div className="ad-banner-large">
                <img 
                  src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Advertisement"
                  className="ad-image-large"
                />
                <div className="ad-content-large">
                  <h3>Nike Air Jordan Collection</h3>
                  <p>Elevate your game with the latest Air Jordans. Performance meets style on and off the court.</p>
                  <button className="ad-cta-large">Shop Now - 20% Off</button>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="community-chat">
              <div className="chat-header">
                <h4>🏆 DaPaint Community</h4>
                <span className="online-count">1,247 online</span>
              </div>
              
              <div className="chat-messages">
                <div className="chat-message">
                  <img src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png" alt="User" className="chat-avatar" />
                  <div className="chat-content">
                    <div className="chat-user">Mike_Hoops23 <span className="chat-time">2m ago</span></div>
                    <div className="chat-text">Just won my 5th game in a row! 🔥 Who's next?</div>
                  </div>
                </div>

                <div className="chat-message">
                  <img src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png" alt="User" className="chat-avatar" />
                  <div className="chat-content">
                    <div className="chat-user">TennisQueen <span className="chat-time">5m ago</span></div>
                    <div className="chat-text">Looking for a tennis match at Central Park. Anyone available?</div>
                  </div>
                </div>

                <div className="chat-message">
                  <img src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png" alt="User" className="chat-avatar" />
                  <div className="chat-content">
                    <div className="chat-user">SoccerPro99 <span className="chat-time">8m ago</span></div>
                    <div className="chat-text">That penalty shootout was intense! GG @FootballFan</div>
                  </div>
                </div>

                <div className="chat-message">
                  <img src="https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png" alt="User" className="chat-avatar" />
                  <div className="chat-content">
                    <div className="chat-user">SwimmerGirl <span className="chat-time">12m ago</span></div>
                    <div className="chat-text">New pool opened downtown! Perfect for racing 🏊‍♀️</div>
                  </div>
                </div>
              </div>

              <div className="chat-input-section">
                <input 
                  type="text" 
                  placeholder="Share your thoughts with the community..." 
                  className="chat-input"
                />
                <button className="chat-send-btn">Send</button>
              </div>
            </div>

            {/* Additional Ad Space */}
            <div className="ad-space-section mt-4">
              <div className="ad-banner-small">
                <div className="ad-content-small">
                  <h5>🎯 Boost Your Performance</h5>
                  <p>Premium sports supplements for champions</p>
                </div>
                <button className="ad-cta-small">Learn More</button>
              </div>
            </div>
          </div>
        ) : (
          // Non-authenticated user content
          <div>
            <h2 className="text-black mb-4" style={{ textAlign: "justify" }}>
              At DaPaint.org, we're reimagining the way people compete and connect through sports.
            </h2>

            <div style={{ textAlign: "justify", marginBottom: "51px" }}>
              <p className="mb-3">
                DaPaint.org transforms your favorite sports into rewarding
                experiences. It's built for players who love competition and
                want to turn their skills into real income.
              </p>
              <p>
                Whether you're a player, fan, or creator, anyone can join
                DaPaint.org to play, connect, and thrive in a community where
                passion meets opportunity.
              </p>
            </div>

            {/* How It Works Section */}
            <section className="how-it-works text-center mb-5">
              <h3 className="mb-4">How It Works</h3>

              <div className="pill-container1 mx-auto bg-black mt-2 mb-3" style={{ fontSize: ".80rem" }}>
                BEAT 10 PLAYERS IN A ROW, WIN $1,000!!
              </div>

              <img
                className="w-50 mb-3"
                src="https://i.ibb.co/bgx7Nn0c/Heading2.png"
                alt="How it works diagram"
                loading="lazy"
              />

              <p className="process-steps">
                Tap "Find Foe" → Lock In A Foe OR Add Your Own →
                Start and Win The Match → Submit Result →
                Repeat Until Win 10 games in a row to earn $1,000 in cash.
              </p>
            </section>

            {/* Earnings Section */}
            <section className="earnings-section text-center mb-5">
              <h3 className="mb-4">Weekly Gift Card Giveaway</h3>

              <p className="m-3">
                Skilled players can earn up to $3,000/month. Let's See How
                Much You Can Earn!
              </p>

              <button
                className="golden-button rounded-pill w-50 mb-3"
                onClick={toggleAuth}
              >
                <span className="golden-text" style={{ fontSize: "17px" }}>
                  Create Your Account
                </span>
              </button>
            </section>
          </div>
        )}
      </section>
      <Footer />

      <style jsx>{`
        .chat-dashboard {
          max-width: 800px;
          margin: 0 auto;
        }

        .ad-space-section {
          margin: 20px 0;
        }

        .ad-banner-large {
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 15px;
          padding: 25px;
          color: white;
          gap: 20px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .ad-image-large {
          width: 120px;
          height: 120px;
          border-radius: 12px;
          object-fit: cover;
        }

        .ad-content-large {
          flex: 1;
        }

        .ad-content-large h3 {
          margin: 0 0 10px 0;
          font-size: 24px;
          font-weight: bold;
        }

        .ad-content-large p {
          margin: 0 0 15px 0;
          font-size: 16px;
          opacity: 0.9;
          line-height: 1.4;
        }

        .ad-cta-large {
          background: white;
          color: #667eea;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .ad-cta-large:hover {
          background: #f0f0f0;
          transform: translateY(-2px);
        }

        .ad-banner-small {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border-radius: 10px;
          padding: 15px 20px;
          color: #333;
        }

        .ad-content-small h5 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: bold;
        }

        .ad-content-small p {
          margin: 0;
          font-size: 14px;
          opacity: 0.8;
        }

        .ad-cta-small {
          background: #333;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          cursor: pointer;
          font-size: 12px;
        }

        .ad-cta-small:hover {
          background: #555;
        }

        .community-chat {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h4 {
          margin: 0;
          color: #333;
          font-weight: bold;
        }

        .online-count {
          background: rgba(0,0,0,0.1);
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 12px;
          color: #333;
          font-weight: bold;
        }

        .chat-messages {
          max-height: 400px;
          overflow-y: auto;
          padding: 20px;
        }

        .chat-message {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .chat-content {
          flex: 1;
        }

        .chat-user {
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
          font-size: 14px;
        }

        .chat-time {
          font-weight: normal;
          color: #666;
          font-size: 12px;
        }

        .chat-text {
          color: #555;
          line-height: 1.4;
          font-size: 14px;
        }

        .chat-input-section {
          display: flex;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #eee;
          background: #f8f9fa;
        }

        .chat-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 25px;
          outline: none;
          font-size: 14px;
        }

        .chat-input:focus {
          border-color: #ffd700;
        }

        .chat-send-btn {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          color: #333;
          border: none;
          padding: 12px 20px;
          border-radius: 25px;
          font-weight: bold;
          cursor: pointer;
          font-size: 14px;
        }

        .chat-send-btn:hover {
          background: linear-gradient(135deg, #ffed4e, #ffd700);
        }

        @media (max-width: 768px) {
          .ad-banner-large {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .ad-image-large {
            width: 80px;
            height: 80px;
          }

          .ad-content-large h3 {
            font-size: 20px;
          }

          .ad-content-large p {
            font-size: 14px;
          }

          .ad-banner-small {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .chat-input-section {
            flex-direction: column;
          }

          .chat-send-btn {
            align-self: flex-end;
            width: auto;
          }
        }
      `}</style>
    </main>
  );
};