import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Username",
    example: "e.g. ballplayer23",
    name: "username",
    type: "text",
  },
  {
    label: "Phone Number",
    example: "e.g. 555-123-4567",
    name: "phone",
    type: "tel",
  },
  {
    label: "Email",
    example: "e.g. you@email.com",
    name: "email",
    type: "email",
  },
  {
    label: "Password",
    example: "Choose a strong password",
    name: "password",
    type: "password",
  },
  {
    label: "City",
    example: "e.g. Atlanta",
    name: "city",
    type: "text",
  },
  {
    label: "Zipcode",
    example: "e.g. 30301",
    name: "zipcode",
    type: "text",
  },
  {
    label: "Birthday",
    example: "e.g. 01/23/2000",
    name: "birthday",
    type: "date",
  },
];

const Auth = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({});
  const [login, setLogin] = useState({ user: "", password: "" });

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (e) => setForm({ ...form, [steps[step].name]: e.target.value });
  const handleLoginChange = (e) => setLogin({ ...login, [e.target.name]: e.target.value });

  const handleSignupSubmit = () => {
    // Mock signup success
    console.log("Signup data:", form);
    // Set authentication token in localStorage
    localStorage.setItem('dapaint_token', 'mock_token_' + Date.now());
    alert("Signup successful! You are now authenticated.");
    // Force page reload to update Layout state
    window.location.href = "/";
  };

  const handleLoginSubmit = () => {
    // Mock login success
    console.log("Login data:", login);
    // Set authentication token in localStorage
    localStorage.setItem('dapaint_token', 'mock_token_' + Date.now());
    alert("Login successful! You are now authenticated.");
    // Force page reload to update Layout state
    window.location.href = "/";
  };

  return (
    <div style={{ background: "#131313", color: "#fefefe", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <img src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png" alt="DaPaint Logo" style={{ width: 120, marginBottom: 24 }} />
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setIsSignup(true)} style={{ background: isSignup ? "#ff0000" : "#131313", color: "#fefefe", border: "none", padding: "8px 16px", marginRight: 8, borderRadius: 4 }}>Sign Up</button>
        <button onClick={() => setIsSignup(false)} style={{ background: !isSignup ? "#ff0000" : "#131313", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Login</button>
      </div>
      {isSignup ? (
        <div style={{ background: "#222", padding: 32, borderRadius: 8, minWidth: 320 }}>
          <h2 style={{ color: "#ff0000" }}>Sign Up - Step {step + 1} of {steps.length}</h2>
          <label style={{ display: "block", margin: "16px 0 8px" }}>{steps[step].label}</label>
          <input
            type={steps[step].type}
            value={form[steps[step].name] || ""}
            onChange={handleChange}
            placeholder={steps[step].example}
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", marginBottom: 8 }}
          />
          <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Example: {steps[step].example}</div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleBack} disabled={step === 0} style={{ background: "#131313", color: "#fefefe", border: "1px solid #ff0000", padding: "8px 16px", borderRadius: 4 }}>Back</button>
            {step < steps.length - 1 ? (
              <button onClick={handleNext} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Next</button>
            ) : (
              <button onClick={handleSignupSubmit} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4 }}>Submit</button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ background: "#222", padding: 32, borderRadius: 8, minWidth: 320 }}>
          <h2 style={{ color: "#ff0000" }}>Login</h2>
          <label style={{ display: "block", margin: "16px 0 8px" }}>Username / Email / Phone</label>
              <input
            type="text"
            name="user"
            value={login.user}
            onChange={handleLoginChange}
            placeholder="e.g. ballplayer23 or you@email.com or 555-123-4567"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", marginBottom: 8 }}
              />
          <label style={{ display: "block", margin: "16px 0 8px" }}>Password</label>
              <input
                type="password"
                name="password"
            value={login.password}
            onChange={handleLoginChange}
            placeholder="Enter your password"
            style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #444", marginBottom: 16 }}
          />
          <button onClick={handleLoginSubmit} style={{ background: "#ff0000", color: "#fefefe", border: "none", padding: "8px 16px", borderRadius: 4, width: "100%" }}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Auth;