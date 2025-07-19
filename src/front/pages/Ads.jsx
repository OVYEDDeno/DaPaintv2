import React from 'react';

const Ads = () => {
  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo-large"
      />
      <h1 className="page-title">Advertise on DaPaint</h1>
      <p className="page-description">
        Promote your brand to our engaged DaPaint community. Reach thousands of active players and sports enthusiasts.
      </p>
      <ul className="profile-features">
        <li>Targeted advertising to sports fans</li>
        <li>High engagement rates</li>
        <li>Multiple ad formats available</li>
        <li>Real-time performance tracking</li>
      </ul>
    </div>
  );
};

export default Ads; 