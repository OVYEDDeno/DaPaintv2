import React, { useState, useRef, useEffect } from "react";

const HEADER_HEIGHT = 34;
const MATCHES_HEIGHT = 90;
const AD_HEIGHT = 90;
const NAV_HEIGHT = 34;
const MAIN_HEIGHT = `calc(100vh - ${HEADER_HEIGHT + MATCHES_HEIGHT + AD_HEIGHT + NAV_HEIGHT}px)`;

const mockMatches = [
  { id: 1, title: "Park Fie", date: "Jan 19", time: "1:00 PM", sport: "⚽", price: 40, ticket: false },
  { id: 2, title: "Downtown", date: "Jan 18", time: "4:00 PM", sport: "🥊", price: 15, ticket: true },
  { id: 3, title: "City Cou", date: "Jan 17", time: "11:00 AM", sport: "🎾", price: 30, ticket: false },
  { id: 4, title: "Venice B", date: "Jan 16", time: "3:00 PM", sport: "🏀", price: 25, ticket: true },
  { id: 5, title: "Central", date: "Jan 15", time: "2:00 PM", sport: "🏀", price: 50, ticket: false },
  { id: 6, title: "MGM Gran", date: "Jul 25", time: "2:00 PM", sport: "🏓", price: 5000, ticket: true },
  { id: 7, title: "LES Skat", date: "Aug 1", time: "2:00 PM", sport: "🛹", price: null, ticket: false },
  { id: 8, title: "1260 NW 100th Terr", date: "Jul 22", time: "2:00 PM", sport: "🏓", price: null, ticket: false },
  { id: 9, title: "Arthur A", date: "Jul 21", time: "2:00 PM", sport: "🏀", price: 150, ticket: true },
  { id: 10, title: "Venice B", date: "Jul 20", time: "2:00 PM", sport: "🏀", price: null, ticket: false },
  { id: 11, title: "Iron Gym", date: "Aug 18", time: "2:00 PM", sport: "🥊", price: 550, ticket: true },
  { id: 12, title: "Park Fie", date: "Aug 17", time: "2:00 PM", sport: "⚽", price: 100, ticket: false },
  { id: 13, title: "Downtown", date: "Aug 19", time: "2:00 PM", sport: "🥊", price: null, ticket: false },
  { id: 14, title: "City Ten", date: "Aug 20", time: "2:00 PM", sport: "🎾", price: 75, ticket: true },
  { id: 15, title: "1260 NW 100th Terr", date: "Aug 1", time: "2:00 PM", sport: "🛹", price: null, ticket: false },
];

const mockChat = [
  { id: 1, user: "Morgan", text: "Who's ready for tomorrow's boxing event? 🥊" },
  { id: 2, user: "Jordan", text: "Just locked in for the downtown showdown! 🔥" },
  { id: 3, user: "Rick Craig", text: "lets goo" },
  { id: 4, user: "Rick Craig", text: "omg" },
];

const mockLeaderboard = [
  { id: 1, name: "Alex Chen", wins: 127, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jordan Smith", wins: 115, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Casey Taylor", wins: 98, avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Morgan Lee", wins: 87, avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, name: "Riley Johnson", wins: 76, avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
];

const Home = () => {
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState(mockChat);

  // Calculate card width including gap
  const cardWidth = 260 + 12; // card width + gap
  const totalCards = mockMatches.length;
  const totalWidth = totalCards * cardWidth;

  // Continuous loop animation with seamless transitions
  useEffect(() => {
    let animationId;
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      if (!isHovered && !isDragging) {
        const deltaTime = currentTime - lastTime;
        const speed = 0.05; // pixels per millisecond
        
        setCurrentTranslate(prev => {
          let newTranslate = prev - (deltaTime * speed);
          
          // Seamless wrapping using modulo - no visible jumps
          // When we've moved one full set width, reset to 0
          if (newTranslate <= -totalWidth) {
            newTranslate = newTranslate + totalWidth;
          }
          // When dragging backwards past 0, wrap to negative end
          else if (newTranslate > 0) {
            newTranslate = newTranslate - totalWidth;
          }
          
          return newTranslate;
        });
      }
      
      lastTime = currentTime;
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, isDragging, totalWidth]);

  // Pause on hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Drag to scroll with wrapping
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaX = e.clientX - startX;
    
    setCurrentTranslate(prev => {
      let newTranslate = prev + deltaX;
      
      // Apply same wrapping logic during drag
      if (newTranslate <= -totalWidth) {
        newTranslate = newTranslate + totalWidth;
      } else if (newTranslate > 0) {
        newTranslate = newTranslate - totalWidth;
      }
      
      return newTranslate;
    });
    
    setStartX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch events for mobile with wrapping
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startX;
    
    setCurrentTranslate(prev => {
      let newTranslate = prev + deltaX;
      
      // Apply same wrapping logic during touch
      if (newTranslate <= -totalWidth) {
        newTranslate = newTranslate + totalWidth;
      } else if (newTranslate > 0) {
        newTranslate = newTranslate - totalWidth;
      }
      
      return newTranslate;
    });
    
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat([...chat, { id: chat.length + 1, user: "You", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="main-container" style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#fefefe" }}>
      <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>MAIN CONTAINER</div>
      {/* Live DaPaint Pills Row */}
      <div className="live-dapaint-section" style={{ height: MATCHES_HEIGHT + 68, background: "#18191c", padding: "1px", borderBottom: "1.5px solid #23272f", display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 24, marginBottom: 18, position: "relative" }}>
        <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>LIVE DAPAINT SECTION</div>
        <div className="button-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, margin: "8px 0 4px 0", position: "relative" }}>
          <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>BUTTON ROW</div>
          {/* Left group */}
          <div className="left-button-group" style={{ display: "flex", gap: 8, position: "relative" }}>
            <div style={{ position: "absolute", top: -10, left: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>LEFT BUTTONS</div>
            <button className="filter-button" style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🪠Filter DaPaint</button>
            <button className="create-button" style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>➕Create A DaPaint</button>
          </div>
          {/* Right group */}
          <div className="right-button-group" style={{ display: "flex", gap: 8, position: "relative" }}>
            <div style={{ position: "absolute", top: -10, right: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>RIGHT BUTTONS</div>
            <button className="all-button" style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🏁ALL</button>
            <button className="foe-button" style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>💢Looking For Foe</button>
            <button className="tickets-button" style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🎟️Selling Tickets</button>
          </div>
        </div>
        {/* Infinite Carousel Container */}
        <div
          className="match-cards-container"
          style={{
            overflow: "hidden",
            padding: "28px 0",
            height: 'auto',
            minHeight: 150,
            position: "relative",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none"
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>MATCH CARDS CONTAINER</div>
          {/* Carousel Track - Continuous loop with duplicated cards */}
          <div
            ref={carouselRef}
            className="carousel-track"
            style={{
              display: "flex",
              gap: 12,
              transform: `translateX(${currentTranslate}px)`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
              width: "fit-content",
              position: "relative"
            }}
          >
            <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>CAROUSEL TRACK</div>
            {/* Duplicate cards for seamless infinite loop */}
            {[...mockMatches, ...mockMatches].map((m, i) => {
              const originalIndex = i % mockMatches.length;
              const hostAvatar = "https://randomuser.me/api/portraits/men/" + ((originalIndex % 5) + 1) + ".jpg";
              const foeAvatar = "https://randomuser.me/api/portraits/women/" + ((originalIndex % 5) + 1) + ".jpg";
              const isVS = m.ticket;
              return (
                <div key={i} className="individual-match-card" style={{
                  background: "#23272f",
                  borderRadius: 10,
                  minWidth: 260,
                  maxWidth: 260,
                  height: 69,
                  color: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 1px 4px 0 rgba(0,0,0,0.07)",
                  padding: "21px 21px 21px 21px",
                  fontSize: 13,
                  border: "1.5px solid #23272f",
                  position: "relative",
                  flexShrink: 0
                }}>
                  <div style={{ position: "absolute", top: 2, left: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>MATCH CARD {originalIndex+1}</div>
                  <div className="match-card-header" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isVS ? 8 : 0, marginBottom: 2 }}>
                    <img className="host-avatar" src={hostAvatar} alt="Host" style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #18191c", background: "#fff", objectFit: "cover" }} />
                    {isVS && <span className="vs-text" style={{ fontWeight: 700, fontSize: 13, margin: "0 4px" }}>vs</span>}
                    {isVS && <img className="foe-avatar" src={foeAvatar} alt="Foe" style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #18191c", background: "#fff", objectFit: "cover" }} />}
                    <span className="match-date-time" style={{ fontWeight: 700, fontSize: 13, marginLeft: 8 }}>{m.date} {m.time}</span>
                  </div>
                  <div className="match-card-details" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#aaa", marginBottom: 2 }}>
                    <span className="sport-icon">{m.sport}</span>
                    <span className="location-name">{m.title}</span>
                  </div>
                  {isVS ? (
                    <button className="ticket-button" style={{ background: "#fefefe", color: "#131313", border: "none", borderRadius: 8, padding: "8px 22px", fontWeight: 700, fontSize: 15, marginTop: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, pointerEvents: isDragging ? 'none' : 'auto' }}>
                      🎟️ ${m.price}
                    </button>
                  ) : (
                    <button className="lock-in-button" style={{ background: "#ff0000", color: "#fff", border: "none", borderRadius: 8, padding: "8px 22px", fontWeight: 700, fontSize: 15, marginTop: 12, cursor: "pointer", pointerEvents: isDragging ? 'none' : 'auto' }}>
                      Lock In DaPaint
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Nike Ad Banner */}
      <div 
        className="nike-ad-banner"
        style={{
          height: AD_HEIGHT,
          background: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          borderRadius: 10,
          padding: "8px 18px",
          fontWeight: 800,
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          gap: 16,
          border: "2.5px solid #fff",
          boxShadow: "0 4px 24px 0 rgba(0,0,0,0.3)",
          margin: "8px 0 12px 0",
          position: "relative",
          transition: "transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s",
          cursor: "pointer"
        }}
      >
        <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#fff", zIndex: 1000 }}>NIKE AD BANNER</div>
        <img 
          className="nike-logo"
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
          alt="Nike" 
          style={{ 
            width: 32, 
            height: 32, 
            marginRight: 12, 
            animation: "nikePulse 1.2s infinite alternate" 
          }} 
        />
        <div className="nike-ad-content">
          <div className="nike-ad-title" style={{ fontWeight: 900, fontSize: 20, letterSpacing: 1 }}>The Future is Here.</div>
          <div className="nike-ad-subtitle" style={{ fontWeight: 500, fontSize: 13, color: "#fff", opacity: 0.92 }}>Nike Adapt Auto Max. Now Available.</div>
        </div>
      </div>
      <style>{`
        .nike-ad-banner:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px 0 rgba(255,0,0,0.28);
        }
        @keyframes nikePulse {
          0% { filter: brightness(1) drop-shadow(0 0 0 #fff); }
          100% { filter: brightness(1.2) drop-shadow(0 0 12px #fff); }
        }
      `}</style>
      {/* Main Content Split */}
      <div className="main-content-container" style={{ height: 'calc(100vh - 410px)', minHeight: 0, display: "flex", gap: 18, alignItems: "flex-start", background: "#fefefe", padding: "12px 16px 0 16px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>MAIN CONTENT CONTAINER</div>
        {/* DaPaint Chat */}
        <div className="chat-container" style={{ flex: 2.5, background: "#18191c", borderRadius: 12, padding: 0, minHeight: 0, display: "flex", flexDirection: "column", height: "100%", fontSize: 15, boxShadow: "0 1px 4px 0 rgba(0,0,0,0.10)", position: "relative" }}>
          <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>CHAT CONTAINER</div>
          <div className="chat-header" style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 16, margin: "16px 0 8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="chat">💬</span> DaPaint Chat
          </div>
          <div className="chat-messages-container" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "0 0 8px 0", display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", top: 2, left: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>CHAT MESSAGES</div>
            {chat.map((msg, idx) => {
              // Assign a unique color per user (simple hash)
              const userColors = ["#ff4d4f", "#1e90ff", "#ffb300", "#20c997", "#cd7f32", "#b3b3b3", "#6f42c1"];
              const colorIdx = Math.abs([...msg.user].reduce((a, c) => a + c.charCodeAt(0), 0)) % userColors.length;
              const userColor = userColors[colorIdx];
              return (
                <div key={msg.id} className="chat-message" style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "4px 0 2px 16px" }}>
                  <img className="chat-user-avatar" src={`https://randomuser.me/api/portraits/${msg.user === 'Morgan' ? 'men/4' : msg.user === 'Jordan' ? 'men/2' : 'women/3'}.jpg`} alt={msg.user} style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #23272f", background: "#23272f", objectFit: "cover" }} />
                  <span className="chat-username" style={{ fontWeight: 700, color: userColor, marginRight: 6, fontSize: 15, textShadow: "0 1px 2px #0008" }}>{msg.user}</span>
                  <span className="chat-message-text" style={{ color: "#fff", fontWeight: 400, fontSize: 15, textShadow: "0 1px 2px #0008" }}>{msg.text}</span>
                </div>
              );
            })}
          </div>
          <form className="chat-input-form" onSubmit={handleSend} style={{ display: "flex", alignItems: "center", gap: 0, background: "#232c3a", borderRadius: "0 0 12px 12px", padding: 0, margin: 0, marginBottom: 12, position: "relative" }}>
            <div style={{ position: "absolute", top: 2, left: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>CHAT INPUT FORM</div>
            <input
              className="chat-input-field"
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Join the conversation..."
              style={{ flex: 1, background: "#232c3a", color: "#fff", border: "none", borderRadius: "0 0 0 12px", padding: "16px 18px", fontSize: 15, outline: "none" }}
            />
            <button className="chat-send-button" type="submit" style={{ background: "#ff0000", color: "#fff", border: "none", borderRadius: "0 0 12px 0", padding: "0 24px", fontWeight: 700, fontSize: 22, height: 56, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}>➤</button>
          </form>
        </div>
        {/* Top Players Leaderboard */}
        <div className="leaderboard-container" style={{ flex: 1, background: "#18191c", borderRadius: 12, padding: 0, minHeight: 0, display: "flex", flexDirection: "column", height: "100%", fontSize: 13, boxShadow: "0 1px 4px 0 rgba(0,0,0,0.10)", position: "relative" }}>
          <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>LEADERBOARD CONTAINER</div>
          <div className="leaderboard-header" style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 16, margin: "16px 0 8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span role="img" aria-label="trophy">🏆</span> Top Players
          </div>
          <div className="leaderboard-players-list" style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, padding: "0 12px 12px 12px", position: "relative" }}>
            <div style={{ position: "absolute", top: 2, left: 2, fontSize: 8, color: "#999", zIndex: 1000 }}>PLAYERS LIST</div>
            {mockLeaderboard.map((p, i) => (
              <div key={p.id} className="leaderboard-player-card" style={{ background: "#23272f", color: "#fff", borderRadius: 8, padding: "10px 12px", fontWeight: 600, display: "flex", alignItems: "center", gap: 10, fontSize: 13, boxShadow: i < 3 ? "0 2px 8px 0 rgba(255,0,0,0.08)" : undefined }}>
                <img className="player-avatar" src={p.avatar} alt={p.name} style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8, border: i < 3 ? "2px solid #ff0000" : "2px solid #23272f" }} />
                <span className="player-rank" style={{ color: i === 0 ? "#ffb300" : i === 1 ? "#b3b3b3" : i === 2 ? "#cd7f32" : "#fff", fontWeight: 700, fontSize: 16, width: 24, display: "inline-block", textAlign: "center" }}>{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}</span>
                <span className="player-name" style={{ flex: 1, fontWeight: 700 }}>{p.name}</span>
                <span className="player-wins" style={{ color: "#aaa", fontWeight: 400, fontSize: 13 }}>{p.wins} wins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <nav className="bottom-navigation" style={{ height: NAV_HEIGHT, position: "fixed", left: 0, right: 0, bottom: 0, background: "#18191c", borderTop: "1.5px solid #23272f", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100 }}>
        <div style={{ position: "absolute", top: 2, left: 2, fontSize: 10, color: "#999", zIndex: 1000 }}>BOTTOM NAVIGATION</div>
        <button className="nav-home-button" style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="home">🏠</span>
          <span style={{ fontSize: 10 }}>Home</span>
        </button>
        <button className="nav-chat-button" style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="chat">💬</span>
          <span style={{ fontSize: 10 }}>Chat</span>
        </button>
        <button className="nav-stats-button" style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="stats">📊</span>
          <span style={{ fontSize: 10 }}>Stats</span>
        </button>
        <button className="nav-profile-button" style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="profile">👤</span>
          <span style={{ fontSize: 10 }}>Profile</span>
        </button>
      </nav>
      {/* Hide scrollbar for all browsers */}
      <style jsx>{`
        div[ref="carouselRef"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Home;