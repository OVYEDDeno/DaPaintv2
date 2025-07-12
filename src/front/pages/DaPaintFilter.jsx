import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DaPaintFilter = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    alert(`Searching for DaPaints in: ${searchQuery}`);
    // In a real app, this would trigger a search and show results
  };

  return (
    <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 32 }} />
      <h1 style={{ color: "#ff0000" }}>Find a DaPaint</h1>
      <p style={{ maxWidth: 500, textAlign: "center", margin: "24px 0" }}>
        Filter and discover DaPaints anywhere, not just in your local area. Search by zipcode, city, or even your number neighbor!
      </p>
      <input 
        type="text" 
        placeholder="Enter zipcode, city, or neighbor..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: 8, borderRadius: 4, border: "1px solid #444", width: 240, marginBottom: 16 }} 
      />
      <button onClick={handleSearch} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Search</button>
    </div>
  );
};

export default DaPaintFilter; 