import React, { useState, useEffect } from "react";

export const Header = ({
  showHome,
  toggleCard,
  toggleHome,
  toggleAds,
  toggleAuth,
  isAuthenticated,
  onLogout,
  showCard,
  currentWinStreak = 7,
  store = { WinStreakGoal: 10 },
  onWinStreakChange,
  toggleProfile,
  toggleDaPaintCreate
}) => {
  const [localWinStreak, setLocalWinStreak] = useState(currentWinStreak);

  useEffect(() => {
    setLocalWinStreak(currentWinStreak);
  }, [currentWinStreak]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleWinStreakChange = (newStreak) => {
    setLocalWinStreak(newStreak);
    if (onWinStreakChange) {
      onWinStreakChange(newStreak);
    }
  };

  const progressPercentage = Math.min((localWinStreak / store.WinStreakGoal) * 100, 100);

  return (
    <>
      <style jsx>{`
        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
        }

        .center-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px;
          position: relative;
        }

        .DaPaintlogo {
          width: 50px;
          max-width: 50px;
          cursor: pointer;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .DaPaintlogo:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .DaPaintlogo2 {
          width: 32px;
          height: 32px;
          cursor: pointer;
          transition: transform 0.3s ease;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .DaPaintlogo2:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .input-pair {
          display: flex;
          gap: 0.5rem;
          width: 100%;
          position: relative;
          align-items: center;
        }

        .btn-danger {
          background-color: #fa0000;
          color: #ffffff;
          border: none;
          font-size: 0.6rem;
          border-radius: 8px;
          cursor: pointer;
          padding: 8px 12px;
          min-height: 40px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-danger:hover {
          background-color: #131313;
          color: #ffffff;
          box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.5);
        }

        .golden-button {
          background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
          color: #333;
          border: none;
          font-size: 0.6rem;
          border-radius: 8px;
          cursor: pointer;
          padding: 8px 12px;
          min-height: 40px;
          text-transform: uppercase;
          white-space: nowrap;
          transition: all 0.3s ease;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .golden-button:hover {
          background: linear-gradient(135deg, #ff8f00 0%, #f57c00 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .left-button, .right-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 5;
        }

        .left-button {
          left: 0;
        }

        .right-button {
          right: 0;
        }

        .progress-container {
          --value: ${progressPercentage};
          --roundness: 0.5rem;
          --stone-50: #fafaf9;
          --stone-800: #292524;
          --yellow-400: #facc15;
          --white-30: rgba(255, 255, 255, 0.3);
          --white-80: rgba(255, 255, 255, 0.8);
          --white-100: rgba(255, 255, 255, 1);

          width: 100%;
          max-width: 280px;
          position: relative;
          background-color: var(--stone-800);
          border-radius: var(--roundness);
          flex: 1;
          margin: 0 15px;
        }

        .progress-bar {
          width: calc(1% * var(--value));
          height: 1.25rem;
          background-color: var(--yellow-400);
          border: 2px solid var(--white-30);
          border-radius: calc(var(--roundness) - 2px);
          position: relative;
          overflow: hidden;
          transition: all 1000ms cubic-bezier(0.5, 0, 0.4, 1);
        }

        .progress-bar::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 0.375rem;
          opacity: 0.5;
          background-image: radial-gradient(var(--white-80) 20%, transparent 20%),
            radial-gradient(var(--white-100) 20%, transparent 20%);
          background-position: 0 0, 4px 4px;
          background-size: 8px 8px;
          mix-blend-mode: hard-light;
          animation: dots 0.5s infinite linear;
        }

        @keyframes dots {
          0% { background-position: 0 0, 4px 4px; }
          100% { background-position: 8px 0, 12px 4px; }
        }

        .custom-circle {
          width: 45px;
          height: 45px;
          background-color: var(--yellow-400);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          color: #000;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid var(--white-30);
          transition: all 0.3s ease;
          overflow: hidden;
          flex-shrink: 0;
        }

        .custom-circle::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          opacity: 0.5;
          background-image: radial-gradient(var(--white-80) 20%, transparent 20%),
            radial-gradient(var(--white-100) 20%, transparent 20%);
          background-position: 0 0, 4px 4px;
          background-size: 8px 8px;
          mix-blend-mode: hard-light;
          animation: dots 0.5s infinite linear;
        }

        .custom-circle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        .custom-circle h4 {
          margin: 0;
          padding: 0;
          line-height: 1;
          text-align: center;
          font-size: 0.9rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
        }

        .custom-circle.custom-end {
          background-color: var(--stone-800);
          color: #ffffff;
          border: 2px solid var(--stone-50);
        }

        .custom-circle.custom-end::before {
          background-image: radial-gradient(rgba(255,255,255,0.3) 20%, transparent 20%),
            radial-gradient(rgba(255,255,255,0.8) 20%, transparent 20%);
          opacity: 0.3;
        }

        .custom-circle.custom-end.bg-yellow {
          background-color: var(--yellow-400);
          color: #000;
          animation: pulse 2s infinite;
          border: 2px solid var(--white-30);
        }

        .custom-circle.custom-end.bg-yellow::before {
          background-image: radial-gradient(var(--white-80) 20%, transparent 20%),
            radial-gradient(var(--white-100) 20%, transparent 20%);
          opacity: 0.5;
        }

        .custom-progress-text {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          position: absolute;
          z-index: 10;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
        }

        .custom-progress-container {
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Mobile Responsive Styles */
        @media (max-width: 768px) {
          .center-container {
            padding: 8px;
          }
          
          .btn-danger, .golden-button {
            font-size: 0.55rem;
            padding: 6px 10px;
            min-height: 40px;
          }
          
          .progress-container {
            max-width: 200px;
            margin: 0 10px;
          }
          
          .custom-circle {
            width: 40px;
            height: 40px;
          }
          
          .custom-circle h4 {
            font-size: 0.8rem;
          }
          
          .DaPaintlogo {
            width: 40px;
            max-width: 40px;
          }
          
          .DaPaintlogo2 {
            width: 28px;
            height: 28px;
          }
        }

        @media (max-width: 480px) {
          .btn-danger, .golden-button {
            font-size: 0;
            padding: 8px;
            min-height: 40px;
            width: 40px;
          }
          
          .btn-danger::after, .golden-button::after {
            font-size: 16px;
          }
          
          .btn-danger.ads-btn::after {
            content: "📢";
          }
          
          .btn-danger.play-btn::after {
            content: "🎮";
          }
          
          .golden-button.auth-btn::after {
            content: "🔐";
          }
          
          .golden-button.logout-btn::after {
            content: "🚪";
          }
          
          .progress-container {
            max-width: 150px;
            margin: 0 8px;
          }
          
          .custom-circle {
            width: 35px;
            height: 35px;
          }
          
          .custom-circle h4 {
            font-size: 0.7rem;
          }
          
          .DaPaintlogo {
            width: 35px;
            max-width: 35px;
          }
          
          .DaPaintlogo2 {
            width: 24px;
            height: 24px;
          }
        }

        @media (max-width: 360px) {
          .btn-danger, .golden-button {
            width: 35px;
            min-height: 35px;
            padding: 6px;
          }
          
          .progress-container {
            max-width: 120px;
            margin: 0 6px;
          }
          
          .custom-circle {
            width: 30px;
            height: 30px;
          }
          
          .custom-circle h4 {
            font-size: 0.6rem;
          }
        }
      `}</style>

      <div className="header-container">
        <header className="center-container input-pair">
          {showCard && (
            showHome ? (
              <button
                className="btn-danger left-button ads-btn"
                onClick={toggleAds}
                title="Advertise On DaPaint"
              >
                <span className="desktop-text">Advertise On DaPaint</span>
              </button>
            ) : (
              <button
                className="btn-danger left-button play-btn"
                onClick={toggleHome}
                title="Play On DaPaint"
              >
                <span className="desktop-text">Play On DaPaint</span>
              </button>
            )
          )}

          {isAuthenticated ? (        
            <div className="custom-progress-container">
              <div className="custom-circle">
                <h4>{localWinStreak}</h4>
              </div>

              <div className="progress-container">
                <div className="progress-bar"></div>
                <span className="custom-progress-text">
                  <div className="center-container">
                    <img
                      src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
                      alt="Logo"
                      className="DaPaintlogo2"
                      onClick={toggleCard}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </span>
              </div>

              <div
                className={`custom-circle custom-end ${
                  localWinStreak >= store.WinStreakGoal ? "bg-yellow" : ""
                }`}
              >
                <h4>{store.WinStreakGoal}</h4>
              </div>
            </div>
          ) : (
            <img
              src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
              alt="DaPaint Logo"
              className="DaPaintlogo"
              onClick={toggleCard}
              style={{ cursor: "pointer" }}
            />
          )}

          {showCard && (
            isAuthenticated ? (
              <button
                className="right-button golden-button logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <span className="desktop-text">Logout</span>
              </button>
            ) : (
              <button
                className="right-button golden-button auth-btn"
                onClick={toggleAuth}
                title="Lock In DaPaint"
              >
                <span className="desktop-text">Lock In DaPaint</span>
              </button>
            )
          )}
        </header>
      </div>

      <style jsx>{`
        @media (min-width: 481px) {
          .desktop-text {
            display: inline;
          }
        }
        
        @media (max-width: 480px) {
          .desktop-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
};