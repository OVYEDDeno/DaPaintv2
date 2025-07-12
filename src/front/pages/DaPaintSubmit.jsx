import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  { label: "Who won?", example: "e.g. Team Red", name: "winner", type: "text" },
  { label: "Who lost?", example: "e.g. Team Blue", name: "loser", type: "text" },
  { label: "Score?", example: "e.g. 21-15", name: "score", type: "text" },
  { label: "Report behavior? (optional)", example: "e.g. Unsportsmanlike conduct", name: "report", type: "text" },
  { label: "Rate your experience", example: "e.g. 5 stars", name: "rating", type: "number", min: 1, max: 5 },
];

const DaPaintSubmit = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));
  const handleChange = (e) => setForm({ ...form, [steps[step].name]: e.target.value });

  const handleSubmit = () => {
    console.log("DaPaint result submitted:", form);
    alert("Result submitted successfully!");
    navigate("/");
  };

  return (
    <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 24 }} />
      <h2 style={{ color: "#ff0000" }}>Submit DaPaint Result - Step {step + 1} of {steps.length}</h2>
      <label style={{ display: "block", margin: "16px 0 8px" }}>{steps[step].label}</label>
      <input
        type={steps[step].type}
        value={form[steps[step].name] || ""}
        onChange={handleChange}
        placeholder={steps[step].example}
        min={steps[step].min}
        max={steps[step].max}
        style={{ width: 320, padding: 8, borderRadius: 4, border: "1px solid #444", marginBottom: 8 }}
      />
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Example: {steps[step].example}</div>
      <div style={{ display: "flex", justifyContent: "space-between", width: 320 }}>
        <button onClick={handleBack} disabled={step === 0} style={{ background: "#131313", color: "#fefefe", border: "1px solid #ff0000", padding: "8px 16px", borderRadius: 4 }}>Back</button>
        {step < steps.length - 1 ? (
          <button onClick={handleNext} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Next</button>
        ) : (
          <button onClick={handleSubmit} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default DaPaintSubmit; 