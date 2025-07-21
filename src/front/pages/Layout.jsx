import React, { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bg } from "../components/Bg";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rightToggle, setRightToggle] = useState(false);
  const [leftToggle, setLeftToggle] = useState(false);
  const [winStreak, setWinStreak] = useState(7);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCard, setShowCard] = useState(true);
  const [devNavPosition, setDevNavPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const devNavRef = useRef(null);

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
        avatar: "https://randomuser.me/api/portraits/men/51.jpg",
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

  // Auto-scroll functionality
  const startAutoScroll = () => {
    if (scrollIntervalRef.current) return;
    
    scrollIntervalRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        if (scrollLeft >= maxScroll) {
          scrollRef.current.scrollLeft = 0;
        } else {
          scrollRef.current.scrollLeft += 1;
        }
      }
    }, 30);
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Event handlers
  const handleAuthToggle = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const handleRightToggle = () => {
    if (rightToggle) {
      navigate("/ads");
    } else {
      navigate("/");
    }
  };

  const handleLeftToggle = () => {
    if (leftToggle) {
      setIsAuthenticated(false);
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleFilterClick = () => {
    navigate("/filter");
  };

  const handleCreateClick = () => {
    navigate("/create");
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

  const handleAdvertiseOnDaPaintClick = () => {
    navigate("/advertise");
  };

  const handleAdvertiseOnDaPaintTokenClick = () => {
    navigate("/advertise-token");
  };

  const handleLockInDaPaintClick = () => {
    navigate("/lockin");
  };

  const handlePlayOnDaPaintClick = () => {
    navigate("/play");
  };

  const handlePlayOnDaPaintTokenClick = () => {
    navigate("/play-token");
  };

  // Dev navigation drag handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.dev-nav-button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    const rect = devNavRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const x = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
    const y = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
    
    setDevNavPosition({
      x: Math.max(0, Math.min(90, x)),
      y: Math.max(0, Math.min(90, y))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div className="layout-container">
      {/* Background Component */}
      <Bg showCard={showCard} />
      
      {/* Header */}
      <header className="header">
        {/* Left action button (Advertise/Play) */}
        <button
          onClick={handleRightToggle}
          className={`header-action-btn ${rightToggle ? 'active' : ''}`}
          aria-label={rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}
          title={rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}
        >
          <span className="header-btn-text">{rightToggle ? (
            <span>🎮</span>
          ) : (
            <span>📢</span>
          )}</span>
          <span className="header-btn-label">{rightToggle ? 'Play On DaPaint' : 'Advertise On DaPaint'}</span>
        </button>

        {/* Center: Logo or Win Streak Tracker */}
        <div className="header-center">
          {isAuthenticated ? (
            <div className="win-streak-container" onClick={handleLogoClick}>
              <span className="win-streak-count">({winStreak})</span>
              <div className="win-streak-bar">
                <div className="progress-bar-left">
                  <div 
                    className="progress-bar-fill"
                    style={{ width: `${(winStreak / 10) * 100}%` }}
                  />
                </div>
                <img
                  src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
                  alt="DaPaint Logo"
                  className="dapaint-logo"
                />
                <div className="progress-bar-right" />
              </div>
              <span className="win-streak-count">(10)</span>
            </div>
          ) : (
            <img
              src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
              alt="DaPaint Logo"
              className="dapaint-logo"
              onClick={handleLogoClick}
            />
          )}
        </div>

        {/* Right action button (Log Out/Lock In) */}
        <button
          onClick={handleLeftToggle}
          className={`header-action-btn ${leftToggle ? 'active' : ''}`}
          aria-label={leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}
          title={leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}
        >
          <span className="header-btn-text">{leftToggle ? (
            <span>😞</span>
          ) : (
            <span>🔒</span>
          )}</span>
          <span className="header-btn-label">{leftToggle ? 'Log Out DaPaint' : 'Lock In DaPaint'}</span>
        </button>
      </header>

      {/* Main content */}
      <Outlet />

      {/* Bottom Navigation - Only for authenticated users */}
      {isAuthenticated && (
        <footer className="bottom-navigation">
          <button className="nav-button" onClick={() => navigate("/")}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </button>
          <button className="nav-button" onClick={() => navigate("/")}>
            <span className="nav-icon">💬</span>
            <span className="nav-label">Chat</span>
          </button>
          <button className="nav-button" onClick={() => navigate("/")}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Stats</span>
          </button>
          <button className="nav-button" onClick={() => navigate("/")}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </button>
        </footer>
      )}

      {/* Dev Navigation */}
      <div 
        ref={devNavRef}
        className="dev-navigation"
        style={{
          left: `${devNavPosition.x}%`,
          top: `${devNavPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="dev-nav-title">Dev Nav:</div>
        <button onClick={() => navigate('/')} className="dev-nav-button">Home</button>
        <button onClick={() => navigate('/ads')} className="dev-nav-button">Ads</button>
        <button onClick={() => navigate('/auth')} className="dev-nav-button">Auth</button>
        <button onClick={() => navigate('/product')} className="dev-nav-button">Product</button>
        <button onClick={() => navigate('/create')} className="dev-nav-button">Create</button>
        <button onClick={() => navigate('/submit')} className="dev-nav-button">Submit</button>
        <button onClick={() => navigate('/filter')} className="dev-nav-button">Filter</button>
        <button onClick={() => navigate('/profile')} className="dev-nav-button">Profile</button>
        <button onClick={() => navigate('/notifications')} className="dev-nav-button">Notifications</button>
        <button onClick={() => navigate('/feedback')} className="dev-nav-button">Feedback</button>
        <button onClick={() => navigate('/advertise')} className="dev-nav-button">Advertise</button>
        <button onClick={() => navigate('/advertise-token')} className="dev-nav-button">Ad Token</button>
        <button onClick={() => navigate('/lockin')} className="dev-nav-button">Lock In</button>
        <button onClick={() => navigate('/play')} className="dev-nav-button">Play</button>
        <button onClick={() => navigate('/play-token')} className="dev-nav-button">Play Token</button>
        <button onClick={() => navigate('/lineupondapaint')} className="dev-nav-button">Lineup On DaPaint</button>
        <button onClick={() => navigate('/sales')} className="dev-nav-button">Sales</button>
        <button onClick={() => navigate('/start')} className="dev-nav-button">Start</button>
        <button onClick={() => navigate('/tickets')} className="dev-nav-button">Tickets</button>
        <button onClick={() => navigate('/ads copy')} className="dev-nav-button">Ads Copy</button>
      </div>
    </div>
  );
};

export default Layout;
