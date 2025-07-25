import React, { useState, useRef, useEffect } from "react";

const HEADER_HEIGHT = 34;
const MATCHES_HEIGHT = 90;
const AD_HEIGHT = 90;
const NAV_HEIGHT = 34;
const MAIN_HEIGHT = `calc(100vh - ${HEADER_HEIGHT + MATCHES_HEIGHT + AD_HEIGHT + NAV_HEIGHT}px)`;

const mockMatches = [
  { id: 1, title: "Park Fie", date: "Jan 19", time: "1:00 PM", sport: "⚽", price: 40, ticket: false },
  { id: 2, title: "Downtown", date: "Jan 18", time: "4:00 PM", sport: "🥊", price: 15, ticket: true },
  { id: 3, title: "City Cou", date: "Jan 17", time: "11:00 AM", sport: "🎾", price: 30, ticket: false },
  { id: 4, title: "Venice B", date: "Jan 16", time: "3:00 PM", sport: "🏀", price: 25, ticket: true },
  { id: 5, title: "Central", date: "Jan 15", time: "2:00 PM", sport: "🏀", price: 50, ticket: false },
  { id: 6, title: "MGM Gran", date: "Jul 25", time: "2:00 PM", sport: "🏓", price: 5000, ticket: true },
  { id: 7, title: "LES Skat", date: "Aug 1", time: "2:00 PM", sport: "🛹", price: null, ticket: false },
  { id: 8, title: "1260 NW 100th Terr", date: "Jul 22", time: "2:00 PM", sport: "🏓", price: null, ticket: false },
];

const mockChat = [
  { id: 1, user: "Morgan", text: "Who's ready for tomorrow's boxing event? ���" },
  { id: 2, user: "Jordan", text: "Just locked in for the downtown showdown! 🔥" },
  { id: 3, user: "Rick Craig", text: "lets goo" },
  { id: 4, user: "Rick Craig", text: "omg" },
];

const mockLeaderboard = [
  { id: 1, name: "Alex Chen", wins: 127, avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "Jordan Smith", wins: 115, avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Casey Taylor", wins: 98, avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
  { id: 4, name: "Morgan Lee", wins: 87, avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, name: "Riley Johnson", wins: 76, avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
];

const Home = () => {
  const carouselRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState(mockChat);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'leaderboard'

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLockInModal, setShowLockInModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Filter state
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'SELLING_TICKETS', 'LOOKING_FOR_FOE'

  // Create DaPaint form state
  const [createForm, setCreateForm] = useState({
    sport: '',
    location: '',
    date: '',
    time: '',
    ticketPrice: '',
    maxPlayers: '',
    description: ''
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dimensions for seamless infinite scroll
  const cardWidth = 260 + 12; // card width + gap
  const filteredMatches = getFilteredMatches();
  const totalCards = filteredMatches.length;
  const singleSetWidth = totalCards * cardWidth;

  // Perfect orbital animation - like Earth rotating
  useEffect(() => {
    let animationId;
    
    const animate = () => {
      if (!isHovered && !isDragging) {
        setTranslateX(prev => {
          // Smooth continuous movement
          let newTranslate = prev - 0.8; // Constant orbital speed
          
          // Seamless loop when we complete one full orbit
          if (Math.abs(newTranslate) >= singleSetWidth) {
            return 0; // Reset to start position for perfect loop
          }
          
          return newTranslate;
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isHovered, isDragging, singleSetWidth]);

  // Mouse and touch event handlers
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleStart = (clientX) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX;
    setTranslateX(prev => {
      let newTranslate = prev + deltaX * 0.8; // Smooth dragging
      
      // Keep within bounds for seamless experience
      if (newTranslate > 0) {
        newTranslate = -(singleSetWidth - Math.abs(newTranslate));
      } else if (Math.abs(newTranslate) >= singleSetWidth) {
        newTranslate = -(Math.abs(newTranslate) - singleSetWidth);
      }
      
      return newTranslate;
    });
    
    setStartX(clientX);
  };

  const handleEnd = () => setIsDragging(false);

  // Mouse events
  const handleMouseDown = (e) => handleStart(e.clientX);
  const handleMouseMove = (e) => {
    e.preventDefault();
    handleMove(e.clientX);
  };

  // Touch events
  const handleTouchStart = (e) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChat([...chat, { id: chat.length + 1, user: "You", text: chatInput }]);
    setChatInput("");
  };

  // Modal handlers
  const handleCreateDaPaint = () => {
    setShowCreateModal(true);
  };

  const handleFilterDaPaint = () => {
    setShowFilterModal(true);
  };

  const handleLockIn = (match) => {
    setSelectedMatch(match);
    setShowLockInModal(true);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit to API
    console.log('Creating DaPaint:', createForm);
    setShowCreateModal(false);
    setCreateForm({
      sport: '',
      location: '',
      date: '',
      time: '',
      ticketPrice: '',
      maxPlayers: '',
      description: ''
    });
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowFilterModal(false);
    setShowLockInModal(false);
    setSelectedMatch(null);
  };

  // Filter functions
  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
  };

  const getFilteredMatches = () => {
    switch (activeFilter) {
      case 'SELLING_TICKETS':
        return mockMatches.filter(match => match.ticket === true);
      case 'LOOKING_FOR_FOE':
        return mockMatches.filter(match => match.ticket === false);
      default:
        return mockMatches;
    }
  };

  return (
    <div style={styles.mainContainer}>
      
      {/* Live DaPaint Pills Row */}
      <div style={styles.liveDaPaintSection}>
        
        <div style={styles.buttonRow}>
          
          {/* Left group */}
          <div style={styles.leftButtonGroup}>
            <button style={styles.filterButton} onClick={handleFilterDaPaint}>🪠Filter DaPaint</button>
            <button style={styles.createButton} onClick={handleCreateDaPaint}>➕Create A DaPaint</button>
          </div>
          
          {/* Right group */}
          <div style={styles.rightButtonGroup}>
            <button
              style={{
                ...styles.allButton,
                ...(activeFilter === 'ALL' ? styles.activeFilterButton : {})
              }}
              onClick={() => handleFilterChange('ALL')}
            >
              🏁ALL
            </button>
            <button
              style={{
                ...styles.foeButton,
                ...(activeFilter === 'LOOKING_FOR_FOE' ? styles.activeFilterButton : {})
              }}
              onClick={() => handleFilterChange('LOOKING_FOR_FOE')}
            >
              💢Looking For Foe
            </button>
            <button
              style={{
                ...styles.ticketsButton,
                ...(activeFilter === 'SELLING_TICKETS' ? styles.activeFilterButton : {})
              }}
              onClick={() => handleFilterChange('SELLING_TICKETS')}
            >
              🎟️Selling Tickets
            </button>
          </div>
        </div>
        
        {/* Perfect Orbital Carousel */}
        <div
          style={{
            ...styles.matchCardsContainer,
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleEnd}
        >
          
          {/* Infinite Orbital Track */}
          <div
            ref={carouselRef}
            style={{
              ...styles.carouselTrack,
              transform: `translateX(${translateX}px)`,
              transition: isDragging ? 'none' : 'none' // No transition for perfect smooth orbit
            }}
          >
            
            {/* Duplicate sets for seamless infinite orbital loop */}
            {filteredMatches.length > 0 ? (
              [...filteredMatches, ...filteredMatches].map((m, i) => {
                const originalIndex = i % filteredMatches.length;
                const hostAvatar = "https://randomuser.me/api/portraits/men/" + ((originalIndex % 5) + 1) + ".jpg";
                const foeAvatar = "https://randomuser.me/api/portraits/women/" + ((originalIndex % 5) + 1) + ".jpg";
                const isVS = m.ticket;

                return (
                  <div key={`${m.id}-${i}`} style={styles.individualMatchCard}>

                    <div style={{
                      ...styles.matchCardHeader,
                      gap: isVS ? '8px' : '0'
                    }}>
                      <img style={styles.hostAvatar} src={hostAvatar} alt="Host" />
                      {isVS && <span style={styles.vsText}>vs</span>}
                      {isVS && <img style={styles.foeAvatar} src={foeAvatar} alt="Foe" />}
                      <span style={styles.matchDateTime}>{m.date} {m.time}</span>
                    </div>

                    <div style={styles.matchCardDetails}>
                      <span style={styles.sportIcon}>{m.sport}</span>
                      <span style={styles.locationName}>{m.title}</span>
                    </div>

                    {isVS ? (
                      <button
                        style={{
                          ...styles.ticketButton,
                          opacity: isDragging ? 0.7 : 1,
                          pointerEvents: isDragging ? 'none' : 'auto'
                        }}
                      >
                        🎟️ ${m.price}
                      </button>
                    ) : (
                      <button
                        style={{
                          ...styles.lockInButton,
                          opacity: isDragging ? 0.7 : 1,
                          pointerEvents: isDragging ? 'none' : 'auto'
                        }}
                        onClick={() => handleLockIn(m)}
                      >
                        Lock In DaPaint
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={styles.noMatchesMessage}>
                <p style={styles.noMatchesText}>No matches found for this filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Nike Ad Banner */}
      <div style={styles.nikeAdBanner}>
        <img 
          style={styles.nikeLogo}
          src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" 
          alt="Nike" 
        />
        <div style={styles.nikeAdContent}>
          <div style={styles.nikeAdTitle}>The Future is Here.</div>
          <div style={styles.nikeAdSubtitle}>Nike Adapt Auto Max. Now Available.</div>
        </div>
      </div>
      
      {/* Mobile Toggle Tabs */}
      {isMobile && (
        <div style={styles.mobileTabContainer}>
          <button 
            style={{
              ...styles.mobileTab,
              ...(activeTab === 'chat' ? styles.mobileTabActive : {})
            }}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button 
            style={{
              ...styles.mobileTab,
              ...(activeTab === 'leaderboard' ? styles.mobileTabActive : {})
            }}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
        </div>
      )}
      
      {/* Main Content Split */}
      <div style={{
        ...styles.mainContentContainer,
        ...(isMobile ? styles.mainContentContainerMobile : {})
      }}>
        
        {/* DaPaint Chat */}
        <div style={{
          ...styles.chatContainer,
          ...(isMobile && activeTab !== 'chat' ? { display: 'none' } : {}),
          ...(isMobile ? styles.chatContainerMobile : {})
        }}>
          <div style={styles.chatHeader}>
            <span role="img" aria-label="chat">💬</span> DaPaint Chat
          </div>
          <div style={styles.chatMessagesContainer}>
            {chat.map((msg) => {
              const userColors = ["#ff4d4f", "#1e90ff", "#ffb300", "#20c997", "#cd7f32", "#b3b3b3", "#6f42c1"];
              const colorIdx = Math.abs([...msg.user].reduce((a, c) => a + c.charCodeAt(0), 0)) % userColors.length;
              const userColor = userColors[colorIdx];
              return (
                <div key={msg.id} style={styles.chatMessage}>
                  <img 
                    style={styles.chatUserAvatar} 
                    src={`https://randomuser.me/api/portraits/${msg.user === 'Morgan' ? 'men/4' : msg.user === 'Jordan' ? 'men/2' : 'women/3'}.jpg`} 
                    alt={msg.user} 
                  />
                  <span style={{...styles.chatUsername, color: userColor}}>{msg.user}</span>
                  <span style={styles.chatMessageText}>{msg.text}</span>
                </div>
              );
            })}
          </div>
          <div style={styles.chatInputForm}>
            <input
              style={styles.chatInputField}
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(e)}
              placeholder="Join the conversation..."
            />
            <button style={styles.chatSendButton} type="button" onClick={handleSend}>🏹</button>
          </div>
        </div>
        
        {/* Top Players Leaderboard */}
        <div style={{
          ...styles.leaderboardContainer,
          ...(isMobile && activeTab !== 'leaderboard' ? { display: 'none' } : {}),
          ...(isMobile ? styles.leaderboardContainerMobile : {})
        }}>
          <div style={styles.leaderboardHeader}>
            <span role="img" aria-label="trophy">🏆</span> Top Players
          </div>
          <div style={styles.leaderboardPlayersList}>
            {mockLeaderboard.map((p, i) => (
              <div key={p.id} style={styles.leaderboardPlayerCard}>
                <img style={styles.playerAvatar} src={p.avatar} alt={p.name} />
                <span style={{
                  ...styles.playerRank,
                  color: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#fff'
                }}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                </span>
                <span style={styles.playerName}>{p.name}</span>
                <span style={styles.playerWins}>{p.wins} wins</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <nav style={styles.bottomNavigation}>
        <button style={styles.navButton}>
          <span role="img" aria-label="home">🏠</span>
          <span style={styles.navButtonText}>Home</span>
        </button>
        <button style={styles.navButton}>
          <span role="img" aria-label="chat">💬</span>
          <span style={styles.navButtonText}>Chat</span>
        </button>
        <button style={styles.navButton}>
          <span role="img" aria-label="stats">📊</span>
          <span style={styles.navButtonText}>Stats</span>
        </button>
        <button style={styles.navButton}>
          <span role="img" aria-label="profile">👤</span>
          <span style={styles.navButtonText}>Profile</span>
        </button>
      </nav>

      {/* Create DaPaint Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>🏆 Create A DaPaint</h2>
              <button style={styles.closeButton} onClick={closeModals}>✕</button>
            </div>
            <form style={styles.modalForm} onSubmit={handleCreateSubmit}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Sport</label>
                  <select
                    style={styles.formInput}
                    value={createForm.sport}
                    onChange={(e) => handleCreateFormChange('sport', e.target.value)}
                    required
                  >
                    <option value="">Select Sport</option>
                    <option value="⚽">⚽ Soccer</option>
                    <option value="🏀">🏀 Basketball</option>
                    <option value="🏈">🏈 Football</option>
                    <option value="🎾">🎾 Tennis</option>
                    <option value="🥊">🥊 Boxing</option>
                    <option value="🏓">🏓 Ping Pong</option>
                    <option value="🛹">���� Skateboarding</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Max Players</label>
                  <input
                    style={styles.formInput}
                    type="number"
                    value={createForm.maxPlayers}
                    onChange={(e) => handleCreateFormChange('maxPlayers', e.target.value)}
                    placeholder="e.g. 10"
                    min="2"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Location</label>
                <input
                  style={styles.formInput}
                  type="text"
                  value={createForm.location}
                  onChange={(e) => handleCreateFormChange('location', e.target.value)}
                  placeholder="e.g. Central Park Basketball Court"
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Date</label>
                  <input
                    style={styles.formInput}
                    type="date"
                    value={createForm.date}
                    onChange={(e) => handleCreateFormChange('date', e.target.value)}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Time</label>
                  <input
                    style={styles.formInput}
                    type="time"
                    value={createForm.time}
                    onChange={(e) => handleCreateFormChange('time', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Ticket Price ($)</label>
                <input
                  style={styles.formInput}
                  type="number"
                  value={createForm.ticketPrice}
                  onChange={(e) => handleCreateFormChange('ticketPrice', e.target.value)}
                  placeholder="e.g. 25"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Description (Optional)</label>
                <textarea
                  style={{...styles.formInput, ...styles.formTextarea}}
                  value={createForm.description}
                  onChange={(e) => handleCreateFormChange('description', e.target.value)}
                  placeholder="Add any additional details about your DaPaint..."
                  rows="3"
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelButton} onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" style={styles.submitButton}>
                  🚀 Create DaPaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div style={styles.modalOverlay} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>🪠 Filter DaPaint</h2>
              <button style={styles.closeButton} onClick={closeModals}>✕</button>
            </div>
            <div style={styles.filterContent}>
              <p style={styles.filterText}>Filter options coming soon!</p>
              <p style={styles.filterSubtext}>You'll be able to filter by sport, location, price range, and date.</p>
            </div>
          </div>
        </div>
      )}

      {/* Lock In Confirmation Modal */}
      {showLockInModal && selectedMatch && (
        <div style={styles.modalOverlay} onClick={closeModals}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>🔒 Lock In DaPaint</h2>
              <button style={styles.closeButton} onClick={closeModals}>✕</button>
            </div>
            <div style={styles.lockInContent}>
              <div style={styles.matchDetails}>
                <div style={styles.matchDetailRow}>
                  <span style={styles.matchDetailLabel}>Sport:</span>
                  <span style={styles.matchDetailValue}>{selectedMatch.sport}</span>
                </div>
                <div style={styles.matchDetailRow}>
                  <span style={styles.matchDetailLabel}>Location:</span>
                  <span style={styles.matchDetailValue}>{selectedMatch.title}</span>
                </div>
                <div style={styles.matchDetailRow}>
                  <span style={styles.matchDetailLabel}>Date & Time:</span>
                  <span style={styles.matchDetailValue}>{selectedMatch.date} at {selectedMatch.time}</span>
                </div>
                {selectedMatch.price && (
                  <div style={styles.matchDetailRow}>
                    <span style={styles.matchDetailLabel}>Entry Fee:</span>
                    <span style={styles.matchDetailValue}>${selectedMatch.price}</span>
                  </div>
                )}
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.cancelButton} onClick={closeModals}>
                  Cancel
                </button>
                <button type="button" style={styles.confirmButton}>
                  ✅ Confirm Lock In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  mainContainer: {
    minHeight: '100vh',
    background: '#0d1117',
    color: '#fff',
    fontFamily: 'anton',
    display: 'flex',
    flexDirection: 'column'
  },
  
  // Live DaPaint Section
  liveDaPaintSection: {
    height: 'calc(90px + 68px)',
    background: '#18191c',
    padding: '1px',
    borderBottom: '1.5px solid #23272f',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: '24px',
    marginBottom: '18px',
    position: 'relative'
  },
  
  // Button Row
  buttonRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '68px',
    margin: '8px 0 4px 0',
    position: 'relative',
    padding: '0 16px'
  },
  
  leftButtonGroup: {
    display: 'flex',
    gap: '8px',
    position: 'relative'
  },
  
  rightButtonGroup: {
    display: 'flex',
    gap: '8px',
    position: 'relative'
  },
  
  // Buttons
  filterButton: {
    background: '#131313',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  createButton: {
    background: '#131313',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  allButton: {
    background: '#131313',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  foeButton: {
    background: '#131313',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  ticketsButton: {
    background: '#131313',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '6px 16px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  
  // Perfect Orbital Carousel
  matchCardsContainer: {
    overflow: 'hidden',
    padding: '28px 0',
    height: 'auto',
    minHeight: '150px',
    position: 'relative',
    userSelect: 'none'
  },
  
  carouselTrack: {
    display: 'flex',
    gap: '12px',
    width: 'fit-content',
    position: 'relative',
    willChange: 'transform' // Optimize for smooth animation
  },
  
  // Match Cards
  individualMatchCard: {
    background: '#23272f',
    borderRadius: '10px',
    minWidth: '260px',
    maxWidth: '260px',
    height: 'auto',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)',
    padding: '21px',
    fontSize: '13px',
    border: '1.5px solid #23272f',
    position: 'relative',
    flexShrink: 0
  },
  
  matchCardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  
  hostAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1.5px solid #18191c',
    background: '#fff',
    objectFit: 'cover'
  },
  
  foeAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    border: '1.5px solid #18191c',
    background: '#fff',
    objectFit: 'cover'
  },
  
  vsText: {
    fontWeight: '700',
    fontSize: '13px',
    margin: '0 4px'
  },
  
  matchDateTime: {
    fontWeight: '700',
    fontSize: '13px',
    marginLeft: '8px'
  },
  
  matchCardDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#aaa',
    marginBottom: '12px'
  },
  
  sportIcon: {
    fontSize: '12px'
  },
  
  locationName: {
    fontSize: '12px'
  },
  
  // Card Buttons
  ticketButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 22px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    background: '#fefefe',
    color: '#131313'
  },
  
  lockInButton: {
    border: 'none',
    borderRadius: '8px',
    padding: '8px 22px',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'opacity 0.2s ease, transform 0.1s ease',
    background: '#ff0000',
    color: '#fff'
  },
  
  // Nike Ad Banner
  nikeAdBanner: {
    height: '90px',
    background: 'linear-gradient(135deg, #000, #333)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    padding: '0 20px'
  },
  
  nikeLogo: {
    height: '40px',
    filter: 'invert(1)'
  },
  
  nikeAdContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  
  nikeAdTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff'
  },
  
  nikeAdSubtitle: {
    fontSize: '14px',
    color: '#ccc'
  },
  
  // Mobile Tab Container
  mobileTabContainer: {
    display: 'flex',
    background: '#23272f',
    borderRadius: '10px 10px 0 0',
    margin: '0 20px',
    overflow: 'hidden'
  },
  
  mobileTab: {
    flex: 1,
    background: '#1a1a1a',
    color: '#ccc',
    border: 'none',
    padding: '15px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  
  mobileTabActive: {
    background: '#23272f',
    color: '#fff'
  },
  
  // Main Content Container
  mainContentContainer: {
    display: 'flex',
    flex: 1,
    gap: '20px',
    padding: '20px',
    minHeight: '400px'
  },
  
  mainContentContainerMobile: {
    padding: '0 20px 20px 20px',
    gap: '0'
  },
  
  // Chat Container - Now matches 9:16 ratio height
  chatContainer: {
    flex: 1,
    background: '#23272f',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '533px' // Same as leaderboard to align bottoms
  },
  
  chatContainerMobile: {
    borderRadius: '0 0 10px 10px',
    height: 'auto',
    minHeight: '400px'
  },
  
  chatHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #2c3e50',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0
  },
  
  chatMessagesContainer: {
    flex: 1,
    padding: '15px 20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  
  chatMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  
  chatUserAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%'
  },
  
  chatUsername: {
    fontWeight: 'bold',
    fontSize: '14px'
  },
  
  chatMessageText: {
    fontSize: '14px',
    color: '#ccc'
  },
  
  chatInputForm: {
    padding: '15px 20px',
    borderTop: '1px solid #2c3e50',
    display: 'flex',
    gap: '10px',
    flexShrink: 0
  },
  
  chatInputField: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    background: '#1a1a1a',
    color: '#fff',
    outline: 'none'
  },
  
  chatSendButton: {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    background: '#ff0000',
    color: '#fff',
    cursor: 'pointer'
  },
  
  // Leaderboard Container - Perfect 9:16 aspect ratio
  leaderboardContainer: {
    width: '300px',
    height: '533px', // 300 * 16/9 = 533px for perfect 9:16 ratio
    background: '#23272f',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexShrink: 0
  },
  
  leaderboardContainerMobile: {
    width: '100%',
    borderRadius: '0 0 10px 10px',
    height: 'auto',
    minHeight: '400px'
  },
  
  leaderboardHeader: {
    padding: '15px 20px',
    borderBottom: '1px solid #2c3e50',
    fontWeight: 'bold',
    fontSize: '16px',
    flexShrink: 0
  },
  
  leaderboardPlayersList: {
    flex: 1,
    padding: '15px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  
  leaderboardPlayerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    borderRadius: '8px',
    background: '#1a1a1a'
  },
  
  playerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  },
  
  playerRank: {
    fontWeight: 'bold',
    fontSize: '16px',
    width: '30px'
  },
  
  playerName: {
    flex: 1,
    fontSize: '14px'
  },
  
  playerWins: {
    fontSize: '12px',
    color: '#ccc'
  },
  
  // Bottom Navigation
  bottomNavigation: {
    height: '60px',
    background: '#23272f',
    borderTop: '1px solid #2c3e50',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '0 20px'
  },
  
  navButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    padding: '10px'
  },
  
  navButtonText: {
    fontSize: '12px'
  },

  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },

  modalContent: {
    background: '#23272f',
    borderRadius: '15px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    borderBottom: '1px solid #2c3e50'
  },

  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
    margin: 0
  },

  closeButton: {
    background: 'none',
    border: 'none',
    color: '#ccc',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  modalForm: {
    padding: '25px'
  },

  formRow: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },

  formGroup: {
    flex: 1,
    marginBottom: '20px'
  },

  formLabel: {
    display: 'block',
    marginBottom: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold'
  },

  formInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '8px',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },

  formTextarea: {
    resize: 'vertical',
    minHeight: '80px'
  },

  modalActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '25px',
    paddingTop: '20px',
    borderTop: '1px solid #2c3e50'
  },

  cancelButton: {
    padding: '12px 24px',
    border: '1px solid #666',
    borderRadius: '8px',
    background: 'transparent',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },

  submitButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: '#FEBF00',
    color: '#000',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },

  confirmButton: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    background: '#28a745',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },

  // Filter Modal Styles
  filterContent: {
    padding: '25px',
    textAlign: 'center'
  },

  filterText: {
    fontSize: '16px',
    color: '#fff',
    marginBottom: '10px'
  },

  filterSubtext: {
    fontSize: '14px',
    color: '#ccc'
  },

  // Lock In Modal Styles
  lockInContent: {
    padding: '25px'
  },

  matchDetails: {
    marginBottom: '25px'
  },

  matchDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #2c3e50'
  },

  matchDetailLabel: {
    fontSize: '14px',
    color: '#ccc',
    fontWeight: 'bold'
  },

  matchDetailValue: {
    fontSize: '14px',
    color: '#fff'
  },

  // Active filter button style
  activeFilterButton: {
    background: '#FEBF00',
    color: '#000'
  },

  // No matches message
  noMatchesMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '300px',
    height: '150px',
    background: '#23272f',
    borderRadius: '10px',
    border: '2px dashed #444'
  },

  noMatchesText: {
    color: '#ccc',
    fontSize: '16px',
    textAlign: 'center'
  }
};

export default Home;
