import React, { useState, useEffect, useRef } from "react";
// import { HostMatchCard } from "./HostMatchCard";

export const HostMatchScroller = ({ 
  onMatchSelect, 
  onTicketPurchase,
  currentUser,
  bearerToken 
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
    },
    {
      id: 5,
      type: 'looking-for-foe',
      sport: "Swimming",
      title: "50m Freestyle Race",
      location: "Olympic Pool",
      time: "7:00 PM",
      prize: "80",
      host: {
        id: 8,
        name: "Katie L.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Woman-3d-Medium-icon.png",
        winStreak: 6,
        rating: 4.6
      }
    },
    {
      id: 6,
      type: 'selling-tickets',
      sport: "MMA",
      title: "Octagon Warriors",
      location: "Fight Arena",
      time: "8:00 PM",
      ticketPrice: "75",
      host: {
        id: 9,
        name: "Connor M.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 14,
        rating: 4.9
      },
      foe: {
        id: 10,
        name: "Khabib N.",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 16,
        rating: 5.0
      }
    },
    {
      id: 7,
      type: 'looking-for-foe',
      sport: "Basketball",
      title: "Miami Street Ball",
      location: "1260 northwest 100th terrace miami fl 33147",
      time: "2024-06-15 19:30",
      prize: "150",
      host: {
        id: 11,
        name: "Miami Baller",
        avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png",
        winStreak: 7,
        rating: 4.8
      }
    }
  ];

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    // Start auto-scroll when component mounts
    startAutoScroll();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [matches, isHovered]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      
      // In real app, fetch from API
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
          const scrollAmount = 2; // Pixels per interval
          container.scrollLeft += scrollAmount;
          
          // Reset to beginning when reaching the end
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 50); // Smooth scrolling every 50ms
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
    <div className="host-match-scroller">
      <div className="scroller-header">
        <h3>🔥 Live Matches - Lock In Now!1</h3>
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
          >
            {/* Duplicate matches for seamless loop */}
            {[...matches, ...matches].map((match, index) => (
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
        .host-match-scroller {
          background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6));
          border-radius: 15px;
          padding: 20px;
          margin: 20px 0;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .scroller-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .scroller-header h3 {
          color: #ffd700;
          margin: 0;
          font-size: 18px;
          font-weight: bold;
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
        }

        .matches-scroll {
          display: flex;
          gap: 15px;
          overflow-x: auto;
          padding: 10px 0;
          scroll-behavior: smooth;
          cursor: pointer;
        }

        .matches-scroll::-webkit-scrollbar {
          height: 6px;
        }

        .matches-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .matches-scroll::-webkit-scrollbar-thumb {
          background: #ffd700;
          border-radius: 3px;
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
          min-width: 400px;
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
          .host-match-scroller {
            padding: 15px;
            margin: 15px 0;
          }

          .scroller-header h3 {
            font-size: 16px;
          }

          .live-indicator {
            font-size: 11px;
          }

          .match-skeleton {
            min-width: 300px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
};