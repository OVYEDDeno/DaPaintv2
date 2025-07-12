import React from "react";

function formatDateTime(datetime) {
  // Accepts 'YYYY-MM-DD HH:mm' or 'YYYY-MM-DDTHH:mm' or Date object
  let dateObj;
  if (typeof datetime === 'string') {
    // Normalize to 'YYYY-MM-DDTHH:mm' for Date parsing
    let norm = datetime.replace(' ', 'T');
    dateObj = new Date(norm);
  } else {
    dateObj = datetime;
  }
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  let hour = dateObj.getHours();
  const min = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${month} ${day} ${hour}:${min}${ampm}`;
}

function formatFullLocation(location) {
  // Ensure location is displayed in full form without abbreviations
  if (!location) return "Location TBD";
  
  // Common abbreviations to expand
  const abbreviations = {
    'St.': 'Street',
    'Ave.': 'Avenue',
    'Blvd.': 'Boulevard',
    'Dr.': 'Drive',
    'Ln.': 'Lane',
    'Rd.': 'Road',
    'Ct.': 'Court',
    'Pl.': 'Place',
    'Cir.': 'Circle',
    'Way': 'Way',
    'N.': 'North',
    'S.': 'South',
    'E.': 'East',
    'W.': 'West',
    'NE': 'Northeast',
    'NW': 'Northwest',
    'SE': 'Southeast',
    'SW': 'Southwest'
  };
  
  let fullLocation = location;
  
  // Replace common abbreviations
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    fullLocation = fullLocation.replace(regex, full);
  });
  
  return fullLocation;
}

export const HostMatchCard = ({ 
  match, 
  onLockIn, 
  onBuyTicket,
  currentUser 
}) => {
  const handleLockIn = () => {
    if (onLockIn) {
      onLockIn(match);
    }
  };

  const handleBuyTicket = () => {
    if (onBuyTicket) {
      onBuyTicket(match);
    }
  };

  // Card Type 1: Host looking for foes
  if (match.type === 'looking-for-foe') {
    return (
      <div className="host-match-card looking-for-foe">
        <div className="match-status-badge">Looking for Foe</div>
        
        <div className="match-info">
          <div className="sport-badge">{match.sport}</div>
          <div className="match-details">
            <div className="match-meta">
              <span>📍 {formatFullLocation(match.location)}</span>
              <span>🕐 {formatDateTime(match.time)}</span>
            </div>
          </div>
        </div>
        
        <div className="host-info">
          <img 
            src={match.host.avatar} 
            alt={match.host.name}
            className="host-avatar"
          />
                     <div className="host-details">
             <span className="host-name">{match.host.name}</span>
           </div>
        </div>

                 <button 
           className="lock-in-btn"
           onClick={handleLockIn}
           disabled={match.host.id === currentUser?.id}
         >
           {match.host.id === currentUser?.id ? "Your Match" : "Lock In DaPaint"}
         </button>
      </div>
    );
  }

  // Card Type 2: Host and foe selling tickets
  return (
    <div className="host-match-card selling-tickets">
      <div className="match-status-badge">Selling Tickets</div>
      
      <div className="match-info">
        <div className="sport-badge">{match.sport}</div>
        <div className="match-details">
          <div className="match-meta">
            <span>📍 {formatFullLocation(match.location)}</span>
            <span>🕐 {formatDateTime(match.time)}</span>
          </div>
        </div>
      </div>
      
      <div className="players-info">
        <div className="player-mini">
          <img src={match.host.avatar} alt={match.host.name} className="player-avatar" />
          <span className="player-name">{match.host.name}</span>
        </div>
        <div className="vs-text">VS</div>
        <div className="player-mini">
          <img src={match.foe.avatar} alt={match.foe.name} className="player-avatar" />
          <span className="player-name">{match.foe.name}</span>
        </div>
      </div>

             <button 
         className="buy-ticket-btn"
         onClick={handleBuyTicket}
       >
         Buy Ticket ${match.ticketPrice}
       </button>
    </div>
  );
};