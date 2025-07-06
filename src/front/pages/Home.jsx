import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Auth";
import { DaPaintCreate } from "../components/DaPaintCreate";
import { MatchInterface } from "../components/MatchInterface";
import { LockInModal } from "../components/LockInModal";
import { TicketModal } from "../components/TicketModal";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { LiveMatchesHeader } from "../components/LiveMatchesHeader";
import { ProfileComponent } from "../components/ProfileComponent";
import { Hometokenno } from "../components/Hometokenno";
import { Adstokenno } from "../components/Adstokenno";
import { Adstoken } from "../components/Adstoken";
import { Bg } from "../components/Bg";

export const Home = () => {
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(true);
  const [showHome, setShowHome] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showDaPaintCreate, setShowDaPaintCreate] = useState(false);
  const [showMatchInterface, setShowMatchInterface] = useState(false);
  const [showLockInModal, setShowLockInModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [bearerToken, setBearerToken] = useState(null);
  const [currentWinStreak, setCurrentWinStreak] = useState(7);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Current User",
    email: "user@example.com",
    avatar: "https://icons.iconarchive.com/icons/microsoft/fluentui-emoji-3d/512/Man-3d-Medium-Dark-icon.png"
  });

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
  
  const toggleDaPaintCreate = () => {
    setShowDaPaintCreate((prevState) => !prevState);
  };

  const toggleMatchInterface = () => {
    setShowMatchInterface((prevState) => !prevState);
  };

  const toggleLockInModal = (match = null) => {
    setSelectedMatch(match);
    setShowLockInModal((prevState) => !prevState);
  };

  const toggleTicketModal = (match = null) => {
    setSelectedMatch(match);
    setShowTicketModal((prevState) => !prevState);
  };

  const toggleProfile = () => {
    setShowProfile((prevState) => !prevState);
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

  const handleDaPaintCreateSuccess = (token) => {
    setBearerToken(token);
    setIsAuthenticated(true);
    setShowDaPaintCreate(false);
  };

  const handleLockInConfirm = (match) => {
    console.log('User confirmed lock in for match:', match);
    setShowMatchInterface(true);
  };

  const handleTicketPurchase = (purchaseData) => {
    console.log('User purchased tickets:', purchaseData);
    alert(`Successfully purchased ${purchaseData.quantity} ticket(s) for $${purchaseData.totalPrice}!`);
  };

  const handleMatchComplete = (matchResult) => {
    console.log('Match completed:', matchResult);
    if (matchResult.winner === 'host') {
      setCurrentWinStreak(prev => prev + 1);
    } else {
      setCurrentWinStreak(0);
    }
    setShowMatchInterface(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    setBearerToken(null);
    setIsAuthenticated(false);
  };

  const handleWinStreakChange = (newStreak) => {
    setCurrentWinStreak(newStreak);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setCurrentUser(prev => ({ ...prev, ...updatedProfile }));
  };

  return (
    <>
      {/* Background Component - Only show when showCard is true */}
      {showCard && <Bg showCard={showCard} />}
      
      <div className="app-container">
        {/* Header Section - Always show when showCard is true */}
        {showCard && (
          <Header
            showHome={showHome}
            toggleCard={toggleCard}
            toggleHome={toggleHome}
            toggleAds={toggleAds}
            toggleAuth={toggleAuth}
            toggleProfile={toggleProfile}
            toggleDaPaintCreate={toggleDaPaintCreate}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            showCard={showCard}
            currentWinStreak={currentWinStreak}
            onWinStreakChange={handleWinStreakChange}
          />
        )}

        {/* Live Matches Header - Show when authenticated and showCard is true */}
        {showCard && isAuthenticated && (
          <LiveMatchesHeader
            onMatchSelect={toggleLockInModal}
            onTicketPurchase={toggleTicketModal}
            currentUser={currentUser}
            bearerToken={bearerToken}
            toggleDaPaintCreate={toggleDaPaintCreate}
          />
        )}

        {/* Main Content Container */}
        {showCard && (
          <div className="main-content">
            {/* Auth Modal */}
            <Auth
              showAuth={showAuth}
              toggleAuth={toggleAuth}
              onAuthSuccess={handleAuthSuccess}
            />

            {/* DaPaintCreate Modal */}
            <DaPaintCreate
              showDaPaintCreate={showDaPaintCreate}
              toggleDaPaintCreate={toggleDaPaintCreate}
              onCreateSuccess={handleDaPaintCreateSuccess}
            />

            {/* Lock In Modal */}
            <LockInModal
              showModal={showLockInModal}
              toggleModal={toggleLockInModal}
              match={selectedMatch}
              onConfirm={handleLockInConfirm}
            />

            {/* Ticket Modal */}
            <TicketModal
              showModal={showTicketModal}
              toggleModal={toggleTicketModal}
              match={selectedMatch}
              onPurchase={handleTicketPurchase}
            />

            {/* Main Content */}
            {showHome && (
              <Hometokenno 
                showDaPaintCreate={showDaPaintCreate}
                toggleDaPaintCreate={toggleDaPaintCreate}
                toggleMatchInterface={toggleMatchInterface}
                toggleLockInModal={toggleLockInModal}
                toggleTicketModal={toggleTicketModal}
                toggleAuth={toggleAuth}
                isAuthenticated={isAuthenticated}
                bearerToken={bearerToken}
                currentUser={currentUser}
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

        {/* Bottom Navigation - Show when authenticated and showCard is true */}
        {showCard && (
          <BottomNav
            currentWinStreak={currentWinStreak}
            onWinStreakChange={handleWinStreakChange}
            toggleProfile={toggleProfile}
            isAuthenticated={isAuthenticated}
          />
        )}

        {/* Profile Component - Full screen overlay */}
        <ProfileComponent
          showProfile={showProfile}
          toggleProfile={toggleProfile}
          currentUser={currentUser}
          bearerToken={bearerToken}
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Match Interface - Full screen overlay, independent of showCard */}
        <MatchInterface
          showMatchInterface={showMatchInterface}
          toggleMatchInterface={toggleMatchInterface}
          bearerToken={bearerToken}
          onMatchComplete={handleMatchComplete}
        />
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .main-content {
          flex: 1;
          padding-top: ${isAuthenticated ? '200px' : '80px'};
          padding-bottom: ${isAuthenticated ? '80px' : '20px'};
          overflow-y: auto;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }

        @media (max-width: 768px) {
          .main-content {
            padding-top: ${isAuthenticated ? '180px' : '70px'};
            padding-bottom: ${isAuthenticated ? '75px' : '15px'};
          }
        }

        @media (max-width: 480px) {
          .main-content {
            padding-top: ${isAuthenticated ? '160px' : '65px'};
            padding-bottom: ${isAuthenticated ? '70px' : '10px'};
          }
        }
      `}</style>
    </>
  );
};