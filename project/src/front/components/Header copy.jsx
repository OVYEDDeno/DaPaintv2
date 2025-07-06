import React from "react";

export const Header = ({
  showHome,
  toggleCard,
  toggleHome,
  toggleAds,
  toggleAuth,
  isAuthenticated,
  onLogout,
  showCard,
  currentWinStreak = 0, // Default to 0
  store = { WinStreakGoal: 10 } // Default store with goal of 10
}) => {
  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="center-container input-pair">
      {/* Only show left button when showCard is true */}
      {showCard && (
        showHome ? (
          <button
            className="btn-danger left-button rounded-pill"
            style={{ fontSize: "13px" }}
            onClick={toggleAds}
          >
            Advertise On DaPaint
          </button>
        ) : (
          <button
            className="btn-danger left-button rounded-pill"
            style={{ fontSize: "13px" }}
            onClick={toggleHome}
          >
            Play On DaPaint
          </button>
        )
      )}

      {/* Logo Section - Changes based on authentication */}
      {isAuthenticated ? (        
        <div className="progress-container mx-auto mb-3 mt-5">
          <div className="custom-circle custom-start">
            <h4>{currentWinStreak}</h4>
          </div>
          <div className="custom-progress-bar">
            <span className="custom-progress-text mb-2">
              <div className="center-container">
                <img
                  src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
                  alt="Logo"
                  className="DaPaintlogo"
                  onClick={toggleCard}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </span>
            <div
              className="custom-progress"
              style={{
                width: `${
                  ((currentWinStreak < store.WinStreakGoal
                    ? currentWinStreak
                    : store.WinStreakGoal) /
                    store.WinStreakGoal) *
                  100
                }%`,
              }}
            ></div>
            <div
              className={`custom-circle mx-auto custom-end ${
                currentWinStreak >= store.WinStreakGoal ? "bg-yellow" : ""
              }`}
            >
              <h4>{store.WinStreakGoal}</h4>
            </div>
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

      {/* Only show right button when showCard is true */}
      {showCard && (
        isAuthenticated ? (
          <button
            className="right-button golden-button rounded-pill"
            style={{ fontSize: "13px" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="right-button golden-button rounded-pill"
            style={{ fontSize: "13px" }}
            onClick={toggleAuth}
          >
            Lock In DaPaint
          </button>
        )
      )}
    </header>
  );
};