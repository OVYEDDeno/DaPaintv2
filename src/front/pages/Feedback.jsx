import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    console.log("Feedback submitted:", feedback);
    alert("Thank you for your feedback!");
    navigate("/");
  };

  return (
    <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 32 }} />
      <h1 style={{ color: "#ff0000" }}>Feedback</h1>
      <p style={{ maxWidth: 500, textAlign: "center", margin: "24px 0" }}>
        We value your feedback! After every form, you'll have a chance to let us know how we're doing. You can also send feedback anytime from this page. Your input helps us improve DaPaint for everyone.
      </p>
      <textarea 
        placeholder="Type your feedback here..." 
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        style={{ width: 320, height: 100, padding: 8, borderRadius: 4, border: "1px solid #444", marginBottom: 16 }} 
      />
      <button onClick={handleSubmit} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Submit Feedback</button>
    </div>
  );
};

export default Feedback; 