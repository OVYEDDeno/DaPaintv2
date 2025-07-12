import React from "react";

const Home = () => {
  return (
    <div style={{ 
      background: "#131313", 
      color: "#fefefe", 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "24px"
    }}>
      <h1 style={{ color: "#ff0000", marginBottom: 24 }}>Welcome to DaPaint</h1>
      <p style={{ maxWidth: 600, textAlign: "center", margin: "24px 0", fontSize: "18px" }}>
        DaPaint is your gateway to local sports, community events, and unique competitions. 
        Connect, compete, and win while building your reputation.
      </p>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: 24, 
        maxWidth: 800, 
        width: "100%",
        marginTop: 32
      }}>
        <div style={{ 
          background: "#222", 
          padding: 24, 
          borderRadius: 12, 
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <h3 style={{ color: "#ff0000", marginBottom: 16 }}>🏆 Compete</h3>
          <p>Find and join local DaPaints near you. Test your skills against worthy opponents.</p>
        </div>
        
        <div style={{ 
          background: "#222", 
          padding: 24, 
          borderRadius: 12, 
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <h3 style={{ color: "#ff0000", marginBottom: 16 }}>📊 Track Stats</h3>
          <p>Monitor your win streaks, performance, and build your competitive reputation.</p>
        </div>
        
        <div style={{ 
          background: "#222", 
          padding: 24, 
          borderRadius: 12, 
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <h3 style={{ color: "#ff0000", marginBottom: 16 }}>💰 Earn Rewards</h3>
          <p>Win prizes, earn recognition, and get rewarded for your competitive spirit.</p>
        </div>
        
        <div style={{ 
          background: "#222", 
          padding: 24, 
          borderRadius: 12, 
          textAlign: "center",
          border: "1px solid #333"
        }}>
          <h3 style={{ color: "#ff0000", marginBottom: 16 }}>🤝 Connect</h3>
          <p>Build your community, meet fellow competitors, and share your passion for sports.</p>
        </div>
      </div>
      
      <div style={{ marginTop: 48, textAlign: "center" }}>
        <h2 style={{ color: "#ff0000", marginBottom: 16 }}>Ready to Start?</h2>
        <p style={{ marginBottom: 24 }}>
          Join thousands of competitors who are already winning on DaPaint!
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: "#ff0000",
            color: "#fefefe",
            border: "none",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#cc0000"}
          onMouseLeave={(e) => e.target.style.background = "#ff0000"}
          >
            Start Competing
          </button>
          <button style={{
            background: "transparent",
            color: "#ff0000",
            border: "2px solid #ff0000",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#ff0000";
            e.target.style.color = "#fefefe";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#ff0000";
          }}
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 