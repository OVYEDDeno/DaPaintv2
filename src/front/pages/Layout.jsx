import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rightToggle, setRightToggle] = useState(false);
  const [leftToggle, setLeftToggle] = useState(false);
  const [winStreak, setWinStreak] = useState(7);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'looking-for-foe', 'selling-tickets'
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Mock data with both types
  const mockMatches = [
    {
      id: 1,
      type: "looking-for-foe",
      sport: "Basketball",
      title: "3v3 Half Court",
      location: "Central Park",
      time: "2024-07-04 15:00",
      prize: 20,
      host: {
        id: 1,
        name: "Jordan",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        winStreak: 5,
        rating: 4.8,
      },
      description: "Bring your A-game! Winner takes all.",
    },
    {
      id: 2,
      type: "selling-tickets",
      sport: "Soccer",
      title: "5v5 Showdown",
      location: "Riverside Field",
      time: "2024-07-05 18:00",
      prize: 15,
      host: {
        id: 2,
        name: "Messi",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        winStreak: 8,
        rating: 5.0,
      },
      foe: {
        id: 3,
        name: "Ronaldo",
        avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      },
      description: "Epic soccer battle! Buy your ticket now.",
    },
    {
      id: 3,
      type: "looking-for-foe",
      sport: "Basketball",
      title: "Miami Street Ball",
      location: "1260 northwest 100th terrace miami fl 33147",
      time: "2024-06-15 19:30",
      prize: 150,
      host: {
        id: 4,
        name: "Miami Baller",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg",
        winStreak: 7,
        rating: 4.8,
      },
      description: "Street ball at its finest! Come test your skills.",
    },
    {
      id: 4,
      type: "selling-tickets",
      sport: "Tennis",
      title: "Court Champions",
      location: "Downtown Tennis Center",
      time: "2024-06-16 14:00",
      prize: 75,
      host: {
        id: 5,
        name: "Tennis Pro",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
        winStreak: 12,
        rating: 4.9,
      },
      foe: {
        id: 6,
        name: "Court Master",
        avatar: "https://randomuser.me/api/portraits/men/48.jpg",
      },
      description: "Professional level tennis match!",
    },
    {
      id: 5,
      type: "looking-for-foe",
      sport: "Soccer",
      title: "Street Soccer Showdown",
      location: "Central Park Field",
      time: "2024-06-17 16:30",
      prize: 60,
      host: {
        id: 7,
        name: "Soccer Star",
        avatar: "https://randomuser.me/api/portraits/men/49.jpg",
        winStreak: 9,
        rating: 4.7,
      },
      description: "Fast-paced street soccer action!",
    },
    {
      id: 6,
      type: "selling-tickets",
      sport: "Boxing",
      title: "Heavyweight Battle",
      location: "Iron Fist Gym",
      time: "2024-06-18 20:00",
      prize: 200,
      host: {
        id: 8,
        name: "Iron Mike",
        avatar: "https://randomuser.me/api/portraits/men/50.jpg",
        winStreak: 15,
        rating: 5.0,
      },
      foe: {
        id: 9,
        name: "The Destroyer",
        avatar: "https://randomuser.me/api/portraits/men/51.jpg",
      },
      description: "Epic boxing match! Don't miss this!",
    },
    {
      id: 7,
      type: "looking-for-foe",
      sport: "Swimming",
      title: "Pool Warriors",
      location: "Olympic Swimming Center",
      time: "2024-06-19 10:00",
      prize: 45,
      host: {
        id: 10,
        name: "Aqua Queen",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        winStreak: 6,
        rating: 4.6,
      },
      description: "50m freestyle challenge!",
    },
    {
      id: 8,
      type: "selling-tickets",
      sport: "MMA",
      title: "Octagon Warriors",
      location: "Fight Club Arena",
      time: "2024-06-20 21:00",
      prize: 150,
      host: {
        id: 11,
        name: "Cage Fighter",
        avatar: "https://randomuser.me/api/portraits/men/52.jpg",
        winStreak: 11,
        rating: 4.8,
      },
      foe: {
        id: 12,
        name: "Submission King",
        avatar: "https://randomuser.me/api/portraits/men/53.jpg",
      },
      description: "Mixed martial arts showdown!",
    },
    {
      id: 9,
      type: "looking-for-foe",
      sport: "Volleyball",
      title: "Beach Volleyball",
      location: "Sunset Beach Courts",
      time: "2024-06-21 17:00",
      prize: 35,
      host: {
        id: 13,
        name: "Beach Bum",
        avatar: "https://randomuser.me/api/portraits/women/34.jpg",
        winStreak: 4,
        rating: 4.5,
      },
      description: "Sun, sand, and volleyball!",
    },
    {
      id: 10,
      type: "selling-tickets",
      sport: "Basketball",
      title: "3v3 Street Ball",
      location: "Downtown Courts",
      time: "2024-06-22 18:30",
      prize: 90,
      host: {
        id: 14,
        name: "Street Legend",
        avatar: "https://randomuser.me/api/portraits/men/54.jpg",
        winStreak: 13,
        rating: 4.9,
      },
      foe: {
        id: 15,
        name: "Court King",
        avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      },
      description: "3v3 street basketball tournament!",
    },
    {
      id: 11,
      type: "looking-for-foe",
      sport: "Track",
      title: "100m Sprint",
      location: "Olympic Stadium",
      time: "2024-06-23 09:00",
      prize: 40,
      host: {
        id: 16,
        name: "Speed Demon",
        avatar: "https://randomuser.me/api/portraits/men/56.jpg",
        winStreak: 8,
        rating: 4.7,
      },
      description: "Fastest man wins!",
    },
    {
      id: 12,
      type: "selling-tickets",
      sport: "Golf",
      title: "Putting Challenge",
      location: "Pine Valley Golf Club",
      time: "2024-06-24 15:00",
      prize: 120,
      host: {
        id: 17,
        name: "Golf Pro",
        avatar: "https://randomuser.me/api/portraits/men/57.jpg",
        winStreak: 10,
        rating: 4.8,
      },
      foe: {
        id: 18,
        name: "Putter Master",
        avatar: "https://randomuser.me/api/portraits/men/58.jpg",
      },
      description: "Precision putting competition!",
    },
    {
      id: 13,
      type: "looking-for-foe",
      sport: "Cycling",
      title: "Mountain Bike Race",
      location: "Rocky Mountain Trails",
      time: "2024-06-25 11:00",
      prize: 80,
      host: {
        id: 19,
        name: "Trail Blazer",
        avatar: "https://randomuser.me/api/portraits/women/35.jpg",
        winStreak: 5,
        rating: 4.6,
      },
      description: "Off-road cycling adventure!",
    },
    {
      id: 14,
      type: "selling-tickets",
      sport: "Table Tennis",
      title: "Ping Pong Masters",
      location: "Community Center",
      time: "2024-06-26 19:00",
      prize: 55,
      host: {
        id: 20,
        name: "Ping Pong Pro",
        avatar: "https://randomuser.me/api/portraits/men/59.jpg",
        winStreak: 14,
        rating: 4.9,
      },
      foe: {
        id: 21,
        name: "Table Tennis King",
        avatar: "https://randomuser.me/api/portraits/men/60.jpg",
      },
      description: "Fast-paced table tennis action!",
    },
    {
      id: 15,
      type: "looking-for-foe",
      sport: "Rock Climbing",
      title: "Wall Warriors",
      location: "Adventure Climbing Gym",
      time: "2024-06-27 13:00",
      prize: 70,
      host: {
        id: 22,
        name: "Climbing Queen",
        avatar: "https://randomuser.me/api/portraits/women/36.jpg",
        winStreak: 7,
        rating: 4.7,
      },
      description: "Vertical challenge awaits!",
    },
  ];

  // Filter matches based on active filter
  const filteredMatches = activeFilter === 'all' 
    ? mockMatches 
    : mockMatches.filter(match => match.type === activeFilter);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('dapaint_token');
    if (token) {
      setIsAuthenticated(true);
      setLeftToggle(true);
    }
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      
      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          container.scrollLeft += 2;
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 50);
    };

    if (isAuthenticated) {
      startAutoScroll();
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAuthenticated, activeFilter]);

  const handleAuthToggle = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setLeftToggle(false);
      localStorage.removeItem('dapaint_token');
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const handleRightToggle = () => {
    setRightToggle(!rightToggle);
    if (!rightToggle) {
      navigate("/ads");
    } else {
      navigate("/");
    }
  };

  const handleLeftToggle = () => {
    if (isAuthenticated) {
      handleAuthToggle();
    } else {
      navigate("/auth");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleFilterClick = () => {
    navigate("/dapaint/filter");
  };

  const handleCreateClick = () => {
    navigate("/dapaint/create");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  const handleProductClick = () => {
    navigate("/product");
  };

  const handleFeedbackClick = () => {
    navigate("/feedback");
  };



  return (
    <div style={{ 
      background: "#131313", 
      height: "100vh", 
      color: "#fefefe",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      {/* Header */}
      <header
        style={{
          width: "100%",
          color: "#fff",
          padding: "6px 14px 0 14px",
          borderRadius: 0,
          boxShadow: "none",
          margin: 0,
          position: "relative",
          zIndex: 10,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 1,
        }}
      >
        <div style={{ 
          display: "flex", 
          width: "100%", 
          alignItems: "center", 
          justifyContent: "space-between", 
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          {/* Left action button (Advertise/Play) */}
          <button
            onClick={handleRightToggle}
            style={{
              background: rightToggle ? '#ff0000' : '#131313',
              color: rightToggle ? '#fefefe' : '#ff0000',
              border: '1px solid #ff0000',
              borderRadius: 4,
              padding: '8px 12px',
              minWidth: 40,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}
            title={rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}
            className="header-action-btn advertise-btn"
          >
            <span className="header-btn-text">{rightToggle ? (
              <span style={{ display: 'inline-block' }}>🎮</span>
            ) : (
              <span style={{ display: 'inline-block' }}>📢</span>
            )}</span>
            <span className="header-btn-label">{rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}</span>
          </button>

          {/* Center: Logo or Win Streak Tracker */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 0, margin: '0 12px' }}>
            {isAuthenticated ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  minWidth: 0,
                  justifyContent: "center",
                  height: 56,
                  cursor: 'pointer',
                }}
                onClick={handleLogoClick}
              >
                <span
                  style={{
                    color: "#ff0000",
                    fontWeight: "bold",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  ({winStreak})
                </span>
                <div
                  className="win-streak-bar"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    className="progress-bar-left"
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "#333",
                      borderRadius: "2px",
                      position: "relative",
                      minWidth: 0,
                      display: "none",
                    }}
                  >
                    <div
                      style={{
                        width: `${(winStreak / 10) * 100}%`,
                        height: "100%",
                        background: "#ff0000",
                        borderRadius: "2px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                  <img
                    src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
                    alt="DaPaint Logo"
                    style={{
                      height: 56,
                      width: "auto",
                      transition: "transform 0.2s ease",
                      display: 'block',
                      margin: '0 auto',
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  />
                  <div
                    className="progress-bar-right"
                    style={{
                      flex: 1,
                      height: "4px",
                      background: "#333",
                      borderRadius: "2px",
                      minWidth: 0,
                      display: "none",
                    }}
                  />
                </div>
                <span
                  style={{
                    color: "#ff0000",
                    fontWeight: "bold",
                    fontSize: "16px",
                    whiteSpace: "nowrap",
                  }}
                >
                  (10)
                </span>
              </div>
            ) : (
              <img
                src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
                alt="DaPaint Logo"
                style={{
                  height: 56,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  display: 'block',
                  margin: '0 auto',
                }}
                onClick={handleLogoClick}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            )}
          </div>

          {/* Right action button (Log Out/Lock In) */}
          <button
            onClick={handleLeftToggle}
            style={{
              background: leftToggle ? '#ff0000' : '#131313',
              color: leftToggle ? '#fefefe' : '#ff0000',
              border: '1px solid #ff0000',
              borderRadius: 4,
              padding: '8px 12px',
              minWidth: 40,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}
            title={leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}
            className="header-action-btn logout-btn"
          >
            <span className="header-btn-text">{leftToggle ? (
              <span style={{ display: 'inline-block' }}>↩️</span>
            ) : (
              <span style={{ display: 'inline-block' }}>🔒</span>
            )}</span>
            <span className="header-btn-label">{leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}</span>
          </button>
        </div>

        {/* Auth section */}
        {/* Removed Upcoming DaPaint and leaderboard ad. Now only in Home.jsx */}
      </header>

      {/* Main content */}
      <Outlet />

      {/* Bottom Navigation - Only for authenticated users */}
      {isAuthenticated && (
        <footer style={{ 
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 56, 
          background: "#131313", 
          borderTop: "1px solid #222", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-around",
          zIndex: 100,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.3)",
          flexShrink: 0
        }}>
          <button 
            onClick={() => navigate("/")}
            style={{ 
              background: "none", 
              border: "none", 
              color: location.pathname === "/" ? "#ff0000" : "#fefefe", 
              cursor: "pointer",
              fontSize: 12,
              fontWeight: location.pathname === "/" ? "bold" : "normal",
              transition: "all 0.2s ease"
            }}
          >
            🏠 Home
          </button>
          <button 
            onClick={handleProductClick}
            style={{ 
              background: "none", 
              border: "none", 
              color: location.pathname === "/product" ? "#ff0000" : "#fefefe", 
              cursor: "pointer",
              fontSize: 12,
              fontWeight: location.pathname === "/product" ? "bold" : "normal",
              transition: "all 0.2s ease"
            }}
          >
            🛍️ Products
          </button>
          <button 
            onClick={handleNotificationsClick}
            style={{ 
              background: "none", 
              border: "none", 
              color: location.pathname === "/notifications" ? "#ff0000" : "#fefefe", 
              cursor: "pointer",
              fontSize: 12,
              fontWeight: location.pathname === "/notifications" ? "bold" : "normal",
              transition: "all 0.2s ease"
            }}
          >
            🔔 Notifications
          </button>
          <button 
            onClick={handleProfileClick}
            style={{ 
              background: "none", 
              border: "none", 
              color: location.pathname === "/profile" ? "#ff0000" : "#fefefe", 
              cursor: "pointer",
              fontSize: 12,
              fontWeight: location.pathname === "/profile" ? "bold" : "normal",
              transition: "all 0.2s ease"
            }}
          >
            👤 Profile
          </button>
        </footer>
      )}
    </div>
  );
};

export default Layout;

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 599px) {
      .header-btn-label {
        display: none !important;
      }
      .header-action-btn {
        min-width: 40px !important;
        padding: 8px !important;
      }
    }
    @media (min-width: 600px) {
      .header-btn-label {
        display: inline !important;
      }
    }
    @media (min-width: 600px) {
      .win-streak-bar .progress-bar-left,
      .win-streak-bar .progress-bar-right {
        display: block !important;
      }
    }
    @media (max-width: 599px) {
      .win-streak-bar .progress-bar-left,
      .win-streak-bar .progress-bar-right {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}