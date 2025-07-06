import React, { useState, useEffect, useRef } from "react";
import { HostMatchCard } from "./HostMatchCard";

export const LiveMatchesHeader = ({ 
  onMatchSelect, 
  onTicketPurchase,
  currentUser,
  bearerToken,
  toggleDaPaintCreate
}) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  // Mock data with both types
  const mockMatches = [
    {
      id: 1,
      type: 'looking-for-foe',
      sport: "Basketball",
      title: "1v1 Court Battle",
      location: "Downtown Court",
      time: "3:00 PM",
      prize: "50",
      host: {
        id: 2,
        name: "Mike Jordan",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 8,
        rating: 4.9
      }
    },
    {
      id: 2,
      type: 'selling-tickets',
      sport: "Tennis",
      title: "Championship Finals",
      location: "City Tennis Club",
      time: "4:30 PM",
      ticketPrice: "25",
      host: {
        id: 3,
        name: "Serena W.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png",
        winStreak: 12,
        rating: 4.8
      },
      foe: {
        id: 4,
        name: "Venus W.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png",
        winStreak: 10,
        rating: 4.7
      }
    },
    {
      id: 3,
      type: 'looking-for-foe',
      sport: "Soccer",
      title: "Penalty Shootout",
      location: "Park Field",
      time: "5:00 PM",
      prize: "100",
      host: {
        id: 5,
        name: "Cristiano R.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 15,
        rating: 5.0
      }
    },
    {
      id: 4,
      type: 'selling-tickets',
      sport: "Boxing",
      title: "Heavyweight Showdown",
      location: "Iron Gym",
      time: "6:00 PM",
      ticketPrice: "50",
      host: {
        id: 6,
        name: "Floyd M.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 20,
        rating: 4.7
      },
      foe: {
        id: 7,
        name: "Mike T.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 18,
        rating: 4.8
      }
    }
  ];

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [matches, isHovered]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setMatches(mockMatches);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading matches:', error);
      setLoading(false);
    }
  };

  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isHovered && matches.length > 0 && scrollRef.current) {
      intervalRef.current = setInterval(() => {
        const container = scrollRef.current;
        if (container) {
          const isMobile = window.innerWidth <= 768;
          const scrollAmount = isMobile ? 1 : 2; // Slower on mobile
          
          container.scrollLeft += scrollAmount;
          
          // Improved loop logic
          const maxScroll = container.scrollWidth - container.clientWidth;
          if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = 0;
          }
        }
      }, isMobile ? 80 : 50); // Slower interval on mobile
    }
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    stopAutoScroll();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startAutoScroll();
  };

  const handleTouchStart = () => {
    setIsHovered(true);
    stopAutoScroll();
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      setIsHovered(false);
      startAutoScroll();
    }, 2000); // Resume after 2 seconds of no touch
  };

  const handleLockIn = (match) => {
    if (onMatchSelect) {
      onMatchSelect(match);
    }
  };

  const handleBuyTicket = (match) => {
    if (onTicketPurchase) {
      onTicketPurchase(match);
    }
  };

  return (
    <div className="live-matches-header">
      <div className="matches-header">
        <button 
          className="create-dapaint-btn"
          onClick={toggleDaPaintCreate}
          title="Create a DaPaint"
        >
          🔥
        </button>
        <h3>Live Matches - Lock In Now!</h3>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>LIVE</span>
        </div>
      </div>
      
      <div className="matches-container">
        {loading ? (
          <div className="loading-matches">
            {[1, 2, 3].map(i => (
              <div key={i} className="match-skeleton">
                <div className="skeleton-content"></div>
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="matches-scroll"
            ref={scrollRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Triple the matches for seamless infinite loop */}
            {[...matches, ...matches, ...matches].map((match, index) => (
              <HostMatchCard
                key={`${match.id}-${index}`}
                match={match}
                onLockIn={handleLockIn}
                onBuyTicket={handleBuyTicket}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .live-matches-header {
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.3);
          padding: 15px 0;
          margin-top: 70px; /* Account for fixed header */
        }

        .matches-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 15px;
        }

        .create-dapaint-btn {
          background: linear-gradient(135deg, #ffd700, #ffed4e);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
        }

        .create-dapaint-btn:hover {
          transform: scale(1.1) rotate(10deg);
          box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
        }

        .matches-header h3 {
          color: #ffd700;
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          flex: 1;
          text-align: center;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #ff4444;
          font-weight: bold;
          font-size: 12px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #ff4444;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        .matches-container {
          position: relative;
          padding: 0 20px;
        }

        .matches-scroll {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding: 10px 0;
          scroll-behavior: smooth;
          cursor: grab;
          -webkit-overflow-scrolling: touch;
        }

        .matches-scroll:active {
          cursor: grabbing;
        }

        .matches-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .matches-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }

        .matches-scroll::-webkit-scrollbar-thumb {
          background: #ffd700;
          border-radius: 2px;
        }

        .matches-scroll::-webkit-scrollbar-thumb:hover {
          background: #ffed4e;
        }

        .loading-matches {
          display: flex;
          gap: 15px;
          overflow-x: auto;
        }

        .match-skeleton {
          min-width: 350px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .skeleton-content {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: skeleton-loading 1.5s infinite;
        }

        @keyframes skeleton-loading {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @media (max-width: 768px) {
          .live-matches-header {
            padding: 12px 0;
            margin-top: 65px;
          }

          .matches-header {
            padding: 0 15px;
            margin-bottom: 12px;
          }

          .create-dapaint-btn {
            width: 35px;
            height: 35px;
            font-size: 18px;
          }

          .matches-header h3 {
            font-size: 16px;
          }

          .live-indicator {
            font-size: 11px;
          }

          .matches-container {
            padding: 0 15px;
          }

          .match-skeleton {
            min-width: 300px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .live-matches-header {
            margin-top: 60px;
          }

          .create-dapaint-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }

          .matches-header h3 {
            font-size: 14px;
          }

          .matches-container {
            padding: 0 10px;
          }
        }
      `}</style>
    </div>
  );
};