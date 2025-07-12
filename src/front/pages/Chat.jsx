import React from "react";

const Chat = () => (
  <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "row", alignItems: "flex-start", justifyContent: "center", padding: 32 }}>
    <div style={{ flex: 2, marginRight: 32 }}>
      <h2 style={{ color: "#ff0000" }}>Community Chat</h2>
      <div style={{ background: "#222", borderRadius: 8, minHeight: 400, width: 400, padding: 16 }}>
        {/* Chat messages would go here */}
        <p style={{ color: "#aaa" }}>[Chat area placeholder]</p>
      </div>
    </div>
    <div style={{ flex: 1, minWidth: 180, maxWidth: 200, aspectRatio: "9/16", background: "#222", borderRadius: 8, padding: 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h3 style={{ color: "#ff0000", marginBottom: 16 }}>Leaderboard</h3>
      <ul style={{ width: "100%", color: "#fefefe", padding: 0, listStyle: "none" }}>
        <li>1. PlayerOne - 20W/5L</li>
        <li>2. PlayerTwo - 18W/7L</li>
        <li>3. PlayerThree - 15W/10L</li>
        <li>4. PlayerFour - 12W/8L</li>
        <li>5. PlayerFive - 10W/12L</li>
      </ul>
      <div style={{ marginTop: 16, color: "#aaa", fontSize: 12 }}>
        Sort by: Wins | Losses | Most Sports Played
      </div>
    </div>
  </div>
);

export default Chat; 