import React from 'react';

const Notifications = () => {
  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo"
      />
      <h1 className="page-title">Notifications</h1>
      <p className="page-description">
        Stay updated with all your DaPaint activities! Here you'll find notifications about matches, earnings, and important updates.
      </p>
      <ul className="profile-features">
        <li>Match invitations and updates</li>
        <li>Earnings notifications</li>
        <li>Win streak achievements</li>
        <li>System announcements</li>
      </ul>
    </div>
  );
};

export default Notifications; 