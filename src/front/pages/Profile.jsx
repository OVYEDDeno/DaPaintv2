import React from "react";

const Profile = () => (
  <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 32 }} />
    <h1 style={{ color: "#ff0000" }}>Your Profile</h1>
    <p style={{ maxWidth: 500, textAlign: "center", margin: "24px 0" }}>
      View and edit your DaPaint profile, see your match history, and upload a profile picture. Keep your info up to date and track your DaPaint journey!
    </p>
    <ul style={{ textAlign: "left", maxWidth: 400 }}>
      <li>Edit your sign up info</li>
      <li>Upload/change profile picture</li>
      <li>View DaPaint history and stats</li>
      <li>See your win streaks and achievements</li>
    </ul>
  </div>
);

export default Profile; 