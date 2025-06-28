import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Auth";
import { Header } from "../components/Header";
import { Hometokenno } from "../components/Hometokenno";
import { Adstokenno } from "../components/Adstokenno";
import { Adstoken } from "../components/Adstoken";
import { Bg } from "../components/Bg"; // Make sure to import Bg component

export const Home = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(true);
  const [showHome, setShowHome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [bearerToken, setBearerToken] = useState(null);

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem('bearerToken');
    if (token) {
      setBearerToken(token);
      setIsAuthenticated(true);
      verifyToken(token);
    }
  }, []);

  // Verify token validity
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
        localStorage.removeItem('bearerToken');
        setBearerToken(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('bearerToken');
      setBearerToken(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  const toggleAuth = () => {
    setShowAuth((prevState) => !prevState);
  };

  const toggleHome = () => {
    setShowHome(true);
    setShowAds(false);
  };

  const toggleAds = () => {
    setShowAds(true);
    setShowHome(false);
  };

  const toggleCard = () => {
    setShowCard((prevState) => !prevState);
  };

  const handleAuthSuccess = (token) => {
    setBearerToken(token);
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    setBearerToken(null);
    setIsAuthenticated(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Background Component - Always render */}
      <Bg showCard={showCard} />
      
      <div className="scroll-container">
        {/* Header Section - Always show */}
        <Header
          showHome={showHome}
          toggleCard={toggleCard}
          toggleHome={toggleHome}
          toggleAds={toggleAds}
          toggleAuth={toggleAuth}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          showCard={showCard}
        />

        {/* Only show content when showCard is true */}
        {showCard && (
          <div className="bg-white">
            {/* Auth */}
            <Auth
              showAuth={showAuth}
              toggleAuth={toggleAuth}
              onAuthSuccess={handleAuthSuccess}
            />

            {/* Main Content */}
            {showHome && (
              <Hometokenno 
                toggleAuth={toggleAuth}
                isAuthenticated={isAuthenticated}
              />
            )}

            {/* Ads Content */}        
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
        )}
      </div>
    </>
  );
};