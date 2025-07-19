import React from 'react';

const Profile = () => {
  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo"
      />
      <h1 className="page-title">Your Profile</h1>
      <p className="page-description">
        Welcome to your DaPaint profile! Here you can manage your account settings, view your stats, and track your progress.
      </p>
      <ul className="profile-features">
        <li>View your win streak and statistics</li>
        <li>Manage your account settings</li>
        <li>Track your earnings and history</li>
        <li>Update your profile information</li>
      </ul>
    </div>
  );
};

export default Profile; 