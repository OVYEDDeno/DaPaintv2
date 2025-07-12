import React from "react";

const Ads = () => (
  <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 200, marginBottom: 32 }} />
    <h1 style={{ color: "#ff0000" }}>Advertise on DaPaint</h1>
    <p style={{ maxWidth: 500, textAlign: "center", margin: "24px 0" }}>
      Reach a passionate, local audience of sports fans and competitors. Promote your brand, products, or events directly to engaged users on DaPaint.
    </p>
    <ul style={{ textAlign: "left", maxWidth: 400 }}>
      <li>Targeted local advertising</li>
      <li>High engagement from active users</li>
      <li>Easy campaign setup and management</li>
      <li>Affordable rates for small businesses</li>
      <li>Grow your brand with DaPaint!</li>
    </ul>
  </div>
);

export default Ads; 