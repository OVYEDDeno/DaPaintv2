import React from "react";

const Notifications = () => (
  <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 32 }} />
    <h1 style={{ color: "#ff0000" }}>Notifications</h1>
    <p style={{ maxWidth: 500, textAlign: "center", margin: "24px 0" }}>
      Get notified about everything that matters to you on DaPaint: match invites, results, friend requests, and more. Stay in the loop!
    </p>
    <ul style={{ textAlign: "left", maxWidth: 400 }}>
      <li>Match invites and updates</li>
      <li>Results and win streaks</li>
      <li>Friend requests and messages</li>
      <li>System and community alerts</li>
    </ul>
  </div>
);

export default Notifications; 