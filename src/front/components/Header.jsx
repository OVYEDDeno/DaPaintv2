import React from "react";

export const Header = ({ 
  showCard, 
  toggleCard, 
  toggleAds, 
  toggleAuth, 
  isAuthenticated, 
  onLogout 
}) => {
  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="center-container input-pair">
      {showCard ? (
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
          onClick={toggleCard}
        >
          Play On DaPaint
        </button>
      )}

      <img
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
        alt="DaPaint Logo"
        className="DaPaintlogo2"
        onClick={toggleCard}
        style={{ cursor: "pointer" }}
      />

      {isAuthenticated ? (
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
      )}
    </header>
  );
};