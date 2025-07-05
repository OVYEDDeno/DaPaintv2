import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Auth";
import { DaPaintCreate } from "../components/DaPaintCreate";
import { MatchInterface } from "../components/MatchInterface";
import { LockInModal } from "../components/LockInModal";
import { TicketModal } from "../components/TicketModal";
import { Header } from "../components/Header";
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
  const [showAds, setShowAds] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [bearerToken, setBearerToken] = useState(null);
  const [currentWinStreak, setCurrentWinStreak] = useState(7);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    name: "Current User",
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
    // Here you would typically:
    // 1. Send API request to lock in
    // 2. Update UI to show match is locked
    // 3. Navigate to match interface
    setShowMatchInterface(true);
  };

  const handleTicketPurchase = (purchaseData) => {
    console.log('User purchased tickets:', purchaseData);
    // Here you would typically:
    // 1. Process payment
    // 2. Send confirmation
    // 3. Add tickets to user account
    alert(`Successfully purchased ${purchaseData.quantity} ticket(s) for $${purchaseData.totalPrice}!`);
  };

  const handleMatchComplete = (matchResult) => {
    console.log('Match completed:', matchResult);
    // Update win streak based on result
    if (matchResult.winner === 'host') {
      setCurrentWinStreak(prev => prev + 1);
    } else {
      setCurrentWinStreak(0); // Reset streak if lost
    }
    setShowMatchInterface(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('bearerToken');
    setBearerToken(null);
    setIsAuthenticated(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleWinStreakChange = (newStreak) => {
    setCurrentWinStreak(newStreak);
  };

  return (
    <>
      {/* Background Component - Only show when showCard is true */}
      {showCard && <Bg showCard={showCard} />}
      
      <div className="scroll-container">
        {/* Header Section - Always show when showCard is true */}
        {showCard && (
          <Header
            showHome={showHome}
            toggleCard={toggleCard}
            toggleHome={toggleHome}
            toggleAds={toggleAds}
            toggleAuth={toggleAuth}
            isAuthenticated={isAuthenticated}
            onLogout={handleLogout}
            showCard={showCard}
            currentWinStreak={currentWinStreak}
            onWinStreakChange={handleWinStreakChange}
          />
        )}

        {/* Only show content when showCard is true */}
        {showCard && (
          <div className="bg-white">
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

        {/* Match Interface - Full screen overlay, independent of showCard */}
        <MatchInterface
          showMatchInterface={showMatchInterface}
          toggleMatchInterface={toggleMatchInterface}
          bearerToken={bearerToken}
          onMatchComplete={handleMatchComplete}
        />
      </div>
    </>
  );
};