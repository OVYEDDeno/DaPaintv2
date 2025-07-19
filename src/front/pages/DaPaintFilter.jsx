import React, { useState } from 'react';

const DaPaintFilter = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="simple-page">
      <img 
        src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" 
        alt="DaPaint Logo" 
        className="page-logo"
      />
      <h1 className="page-title">Find a DaPaint</h1>
      <p className="page-description">
        Search for available DaPaint matches in your area. Filter by location, sport, or skill level.
      </p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter location or sport..."
        className="search-input"
      />
      <button onClick={handleSearch} className="primary-button">Search</button>
    </div>
  );
};

export default DaPaintFilter; 