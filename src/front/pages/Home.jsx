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
  { id: 8, title: "Prospect", date: "Jul 22", time: "2:00 PM", sport: "🏓", price: null, ticket: false },
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
  const scrollRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState(mockChat);

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
      scrollIntervalRef.current = setInterval(() => {
        if (scrollRef.current) {
          const container = scrollRef.current;
          container.scrollLeft += 0.2;
          if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
            container.scrollLeft = 0;
          }
        }
      }, 50);
    };
    startAutoScroll();
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // --- Infinite auto-scroll, pause on hover, drag to scroll ---
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    function autoScroll() {
      if (!isHovered && !isDragging) {
        container.scrollLeft += 1.2;
        if (container.scrollLeft >= container.scrollWidth / 1.2) {
          container.scrollLeft = 0;
        }
      }
    }
    scrollIntervalRef.current = setInterval(autoScroll, 16);
    return () => clearInterval(scrollIntervalRef.current);
  }, [isDragging, isHovered]);

  // Pause on hover
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleMouseLeaveDrag = () => setIsDragging(false);

  // Drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX);
    scrollRef.current.scrollLeft = scrollLeft - walk;
    // Loop logic for drag
    if (scrollRef.current.scrollLeft < 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2 + scrollRef.current.scrollLeft;
    } else if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - scrollRef.current.scrollWidth / 2;
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX);
    scrollRef.current.scrollLeft = scrollLeft - walk;
    if (scrollRef.current.scrollLeft < 0) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2 + scrollRef.current.scrollLeft;
    } else if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollLeft - scrollRef.current.scrollWidth / 2;
    }
  };
  const handleTouchEnd = () => setIsDragging(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat([...chat, { id: chat.length + 1, user: "You", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#111" }}>
      {/* Live DaPaint Pills Row */}
      <div style={{ height: MATCHES_HEIGHT + 68, background: "#18191c", padding: "1px", borderBottom: "1.5px solid #23272f", display: "flex", flexDirection: "column", justifyContent: "center", marginTop: 24, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, margin: "8px 0 4px 0" }}>
          {/* Left group */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🏁ALL</button>
            <button style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>💢Looking For Foe</button>
            <button style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🎟️Selling Tickets</button>
          </div>
          {/* Right group */}
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>🪠Filter DaPaint</button>
            <button style={{ background: "#23272f", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>➕Create A DaPaint</button>
          </div>
        </div>
        {/* Improved Match Cards Row */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            overflowX: "scroll",
            gap: 12,
            padding: "28px 0",
            height: 'auto',
            minHeight: 150,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={e => { handleMouseLeave(); handleMouseLeaveDrag(); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeaveCapture={handleMouseLeaveDrag}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Duplicate cards for infinite loop */}
          {[...mockMatches.slice(0, 8), ...mockMatches.slice(0, 8)].map((m, i) => {
            const hostAvatar = "https://randomuser.me/api/portraits/men/" + ((i % 5) + 1) + ".jpg";
            const foeAvatar = "https://randomuser.me/api/portraits/women/" + ((i % 5) + 1) + ".jpg";
            const isVS = m.ticket;
            return (
              <div key={i + '-' + m.id} style={{
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
                position: "relative"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: isVS ? 8 : 0, marginBottom: 2 }}>
                  <img src={hostAvatar} alt="Host" style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #18191c", background: "#fff", objectFit: "cover" }} />
                  {isVS && <span style={{ fontWeight: 700, fontSize: 13, margin: "0 4px" }}>vs</span>}
                  {isVS && <img src={foeAvatar} alt="Foe" style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid #18191c", background: "#fff", objectFit: "cover" }} />}
                  <span style={{ fontWeight: 700, fontSize: 13, marginLeft: 8 }}>{m.date} {m.time}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#aaa", marginBottom: 2 }}>
                  <span>{m.sport}</span>
                  <span>{m.title}</span>
                </div>
                {isVS ? (
                  <button style={{ background: "#fefefe", color: "#131313", border: "none", borderRadius: 8, padding: "8px 22px", fontWeight: 700, fontSize: 15, marginTop: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, pointerEvents: isDragging ? 'none' : 'auto' }}>
                    🎟️ ${m.price}
                  </button>
                ) : (
                  <button style={{ background: "#ff0000", color: "#fff", border: "none", borderRadius: 8, padding: "8px 22px", fontWeight: 700, fontSize: 15, marginTop: 12, cursor: "pointer", pointerEvents: isDragging ? 'none' : 'auto' }}>
                    Lock In DaPaint
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Nike Ad Banner */}
      <div style={{ height: AD_HEIGHT, background: "#111", color: "#fff", borderRadius: 6, padding: "4px 10px", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 8, borderBottom: "1.5px solid #23272f" }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" style={{ width: 18, height: 18, marginRight: 6 }} />
        <div>
          <div>The Future is Here.</div>
          <div style={{ fontWeight: 400, fontSize: 10, color: "#aaa" }}>Nike Adapt Auto Max. Now Available.</div>
        </div>
      </div>
      {/* Main Content Split */}
      <div style={{ height: '220px', minHeight: 0, display: "flex", gap: 6, alignItems: "flex-start", background: "#111", padding: "4px 4px 0 4px", overflow: "hidden" }}>
        {/* Community Chat */}
        <div style={{ flex: 2, background: "#18191c", borderRadius: 6, padding: 4, minHeight: 0, display: "flex", flexDirection: "column", height: "100%", fontSize: 11 }}>
          <div style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 12, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
            <span role="img" aria-label="chat">💬</span> Community Chat
          </div>
          <div style={{ flex: 1, overflowY: "auto", marginBottom: 4, minHeight: 0 }}>
            {chat.map((msg) => (
              <div key={msg.id} style={{ background: "#23272f", color: "#fff", borderRadius: 4, padding: "4px 8px", marginBottom: 4, fontWeight: 500, fontSize: 11 }}>
                <span style={{ color: "#fff", fontWeight: 700 }}>{msg.user}</span> <br />
                <span style={{ color: "#b3b3b3" }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} style={{ display: "flex", gap: 4 }}>
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Join the conversation..."
              style={{ flex: 1, background: "#23272f", color: "#fff", border: "none", borderRadius: 4, padding: "6px 8px", fontSize: 11 }}
            />
            <button type="submit" style={{ background: "#fa0000", color: "#fff", border: "none", borderRadius: 4, padding: "0 10px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
          </form>
        </div>
        {/* Top Players Leaderboard */}
        <div style={{ flex: 1, background: "#18191c", borderRadius: 6, padding: 4, minHeight: 0, display: "flex", flexDirection: "column", height: "100%", fontSize: 11 }}>
          <div style={{ color: "#ff4d4f", fontWeight: 700, fontSize: 12, marginBottom: 3, display: "flex", alignItems: "center", gap: 4 }}>
            <span role="img" aria-label="trophy">🏆</span> Top Players
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            {mockLeaderboard.map((p, i) => (
              <div key={p.id} style={{ background: "#23272f", color: "#fff", borderRadius: 4, padding: "5px 7px", marginBottom: 4, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                <img src={p.avatar} alt={p.name} style={{ width: 16, height: 16, borderRadius: "50%", marginRight: 4 }} />
                <span style={{ color: i === 0 ? "#ffb300" : "#aaa", fontWeight: 700, fontSize: 12, width: 16, display: "inline-block" }}>{i === 0 ? <span>🥇</span> : i === 1 ? <span>🥈</span> : i === 2 ? <span>🥉</span> : `#${i+1}`}</span>
                <span style={{ flex: 1 }}>{p.name}</span>
                <span style={{ color: "#aaa", fontWeight: 400, fontSize: 10 }}>{p.wins} wins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <nav style={{ height: NAV_HEIGHT, position: "fixed", left: 0, right: 0, bottom: 0, background: "#18191c", borderTop: "1.5px solid #23272f", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 100 }}>
        <button style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="home">🏠</span>
          <span style={{ fontSize: 10 }}>Home</span>
        </button>
        <button style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="chat">💬</span>
          <span style={{ fontSize: 10 }}>Chat</span>
        </button>
        <button style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="stats">📊</span>
          <span style={{ fontSize: 10 }}>Stats</span>
        </button>
        <button style={{ background: "none", border: "none", color: "#fff", fontWeight: 600, fontSize: 13, display: "flex", flexDirection: "column", alignItems: "center", gap: 1, cursor: "pointer" }}>
          <span role="img" aria-label="profile">👤</span>
          <span style={{ fontSize: 10 }}>Profile</span>
        </button>
      </nav>
      {/* Hide scrollbar for all browsers */}
      <style jsx>{`
        div[ref="scrollRef"]::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Home; 