import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Auth";
import { Header } from "../components/Header";
import { Hometokenno } from "../components/Hometokenno";
import { Adstokenno } from "../components/Adstokenno";
import { Adstoken } from "../components/Adstoken";

export const Home = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Changed to false initially
  const [bearerToken, setBearerToken] = useState(null);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('bearerToken');
    if (token) {
      setBearerToken(token);
      setIsAuthenticated(true);
      // Optional: verify token validity
      verifyToken(token);
    }
  }, []);

  // Verify token validity (optional - you can add API call to verify)
  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/verify-token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('bearerToken');
        setBearerToken(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // On error, assume token is invalid
      localStorage.removeItem('bearerToken');
      setBearerToken(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const toggleCard = () => {
    setShowCard(true);
    setShowAds(false);
  };

  const toggleAuth = () => {
    setShowAuth((prevState) => !prevState);
  };

  const toggleAds = () => {
    setShowAds(true);
    setShowCard(false);
  };

  const handleAuthSuccess = (token) => {
    setBearerToken(token);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bearerToken'); // Clear token from storage
    setBearerToken(null);
    setIsAuthenticated(false);
    // Optionally redirect to home or show a message
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="scroll-container">
        {/* Header Section */}
        <Header 
          showCard={showCard}
          toggleCard={toggleCard}
          toggleAds={toggleAds}
          toggleAuth={toggleAuth}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />

        {/* Auth */}
        <Auth 
          showAuth={showAuth}
          toggleAuth={toggleAuth}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Main Content */}
        {showCard && (
          <Hometokenno 
            toggleAuth={toggleAuth}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* Ads Content - Show Adstoken if authenticated, Adstokenno if not */}
        {showAds && (
          isAuthenticated ? (
            <Adstoken 
              bearerToken={bearerToken}
              onLogout={handleLogout}
            />
          ) : (
            <Adstokenno 
              toggleAuth={toggleAuth}
            />
          )
        )}
      </div>
    </>
  );
};