import React from "react";

export const BottomNav = ({ 
  currentWinStreak, 
  onWinStreakChange, 
  toggleProfile,
  isAuthenticated 
}) => {
  const increaseStreak = () => {
    const newStreak = currentWinStreak + 1;
    if (onWinStreakChange) {
      onWinStreakChange(newStreak);
    }
  };

  const decreaseStreak = () => {
    const newStreak = Math.max(0, currentWinStreak - 1);
    if (onWinStreakChange) {
      onWinStreakChange(newStreak);
    }
  };

  const resetStreak = () => {
    if (onWinStreakChange) {
      onWinStreakChange(0);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="bottom-nav">
        {/* <button
          onClick={decreaseStreak}
          className="nav-btn decrease-btn"
          title="Decrease Streak"
        >
          <span className="nav-icon">➖</span>
          <span className="nav-label">Decrease</span>
        </button> */}
        
        <button
          onClick={toggleProfile}
          className="nav-btn profile-btn"
          title="Profile"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </button>
        <button
          onClick={toggleProfile}
          className="nav-btn profile-btn"
          title="Profile"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Notifications</span>
        </button>
        <button
          onClick={toggleProfile}
          className="nav-btn profile-btn"
          title="Profile"
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">Settings</span>
        </button>
        
        <button
          onClick={increaseStreak}
          className="nav-btn increase-btn"
          title="Increase Streak"
        >
          <span className="nav-icon">➕</span>
          <span className="nav-label">Increase</span>
        </button>
        
        <button
          onClick={resetStreak}
          className="nav-btn reset-btn"
          title="Reset Streak"
        >
          <span className="nav-icon">🔄</span>
          <span className="nav-label">Reset</span>
        </button>
      </div>

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 215, 0, 0.3);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 8px 0;
          z-index: 99;
          height: 70px;
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          min-width: 60px;
          min-height: 50px;
        }

        .nav-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: translateY(-2px);
        }

        .nav-btn:active {
          transform: translateY(0);
        }

        .nav-icon {
          font-size: 20px;
          margin-bottom: 4px;
        }

        .nav-label {
          font-size: 10px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .decrease-btn:hover {
          background: rgba(255, 0, 0, 0.2);
        }

        .increase-btn:hover {
          background: rgba(0, 255, 0, 0.2);
        }

        .profile-btn:hover {
          background: rgba(255, 215, 0, 0.3);
        }

        .reset-btn:hover {
          background: rgba(128, 128, 128, 0.2);
        }

        @media (max-width: 480px) {
          .bottom-nav {
            padding: 6px 0;
            height: 65px;
          }

          .nav-btn {
            padding: 6px 8px;
            min-width: 50px;
            min-height: 45px;
          }

          .nav-icon {
            font-size: 18px;
            margin-bottom: 2px;
          }

          .nav-label {
            font-size: 9px;
          }
        }

        @media (max-width: 360px) {
          .bottom-nav {
            height: 60px;
          }

          .nav-btn {
            padding: 4px 6px;
            min-width: 45px;
            min-height: 40px;
          }

          .nav-icon {
            font-size: 16px;
          }

          .nav-label {
            font-size: 8px;
          }
        }
      `}</style>
    </>
  );
};