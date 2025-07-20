import React, { useState } from "react";

// Emojis for overlay
const EMOJI_SET = [
  '🏀', '⚽', '🏆', '💸', '🎉', '😁', '🥇', '🤩', '🎊', '🏈', '🎾', '🥳', '💰', '🙌', '🔥', '🏅', '🤸', '🏐', '🏓', '🏸', '⛹️', '🤾', '🤑', '😎', '👏'
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmojis(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(EMOJI_SET[getRandomInt(0, EMOJI_SET.length - 1)]);
  }
  return arr;
}

const PlayOnDaPaint = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Calculator state
  const [ticketPrice, setTicketPrice] = useState(20);
  const [attendees, setAttendees] = useState(25);
  const [daPaintsPerWeek, setDaPaintsPerWeek] = useState(7);

  const WEEKS_PER_MONTH = 4;
  const PLATFORM_FEE_RATE = 0.05;
  const STRIPE_PERCENT = 0.029;
  const STRIPE_FLAT_FEE = 0.3;

  // Emoji overlay logic - fewer emojis on mobile
  const isMobile = window.innerWidth <= 768;
  const emojiCount = isMobile ? getRandomInt(2, 4) : getRandomInt(4, 8);
  const emojis = React.useMemo(() => getRandomEmojis(emojiCount), [emojiCount]);

  // Create non-overlapping positions using a grid approach
  const emojiPositions = React.useMemo(() => {
    const positions = [];
    const gridSize = Math.ceil(Math.sqrt(emojiCount));
    const sectionWidth = 100 / gridSize;
    const sectionHeight = isMobile ? 50 / gridSize : 70 / gridSize; // Smaller area on mobile
    
    for (let i = 0; i < emojiCount; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      // Add some randomness within each grid section, but less on mobile
      const randomRange = isMobile ? 10 : 15;
      const randomX = getRandomInt(5, sectionWidth - randomRange);
      const randomY = getRandomInt(5, sectionHeight - randomRange);
      
      positions.push({
        top: `${row * sectionHeight + randomY}%`,
        left: `${col * sectionWidth + randomX}%`,
        fontSize: isMobile ? `${getRandomInt(20, 32)}px` : `${getRandomInt(32, 64)}px`,
        rotate: `${getRandomInt(-25, 25)}deg`,
      });
    }
    
    return positions;
  }, [emojiCount, isMobile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    setError("");
  };

  const grossWeeklyRevenue = ticketPrice * attendees * daPaintsPerWeek;
  const grossMonthlyRevenue = grossWeeklyRevenue * WEEKS_PER_MONTH;
  const platformFee = grossMonthlyRevenue * PLATFORM_FEE_RATE;
  const totalTicketsSold = attendees * daPaintsPerWeek * WEEKS_PER_MONTH;
  const stripeFees =
    grossMonthlyRevenue * STRIPE_PERCENT + totalTicketsSold * STRIPE_FLAT_FEE;
  const netMonthlyEarnings = grossMonthlyRevenue - platformFee - stripeFees;

  return (
    <>
      <div className="play-container">
        {/* Hero Section */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1 className="play-title" style={{ position: 'relative', zIndex: 2 }}>
            Earn an Income from Playing Any Sport
            {/* Emoji overlay */}
            {emojis.map((emoji, i) => (
              <span
                key={i}
                className="emoji-overlay"
                style={{
                  top: emojiPositions[i].top,
                  left: emojiPositions[i].left,
                  fontSize: emojiPositions[i].fontSize,
                  transform: `rotate(${emojiPositions[i].rotate})`,
                }}
              >
                {emoji}
              </span>
            ))}
          </h1>
        </div>
        {/* <h1 className="play-title">Only on DaPaint.org</h1> */}
        <section className="play-section fadeInDown">
          <p className="play-paragraph">
            DaPaint helps sports lovers like you turn playtime into paytime.
            Ready to join the movement?
          </p>
          <form onSubmit={handleSubmit} className="play-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="play-input"
            />
            <button type="submit" className="play-button">
              Lock In DaPaint
            </button>
          </form>
          {error && <p className="play-error">{error}</p>}
          {submitted && (
            <p className="play-success">
              Check your inbox to verify and start earning!
            </p>
          )}
          <p className="play-small-text">
            Already signed up? Enter your email to unlock your account.
          </p>
        </section>

        {/* Features Section */}
        <section className="play-features-section">
          {[
            {
              title: "Play and Earn Anywhere",
              desc: "No limits — your city, your country, your schedule.",
            },
            {
              title: "10 Win Streak = $1,000 Cash",
              desc: "Create matches, ticket them, and win big alongside your community.",
            },
            {
              title: "Community Chat to Keep You Motivated",
              desc: "Connect, share tips, and stay on your winning streak.",
            },
          ].map(({ title, desc }, i) => (
            <div key={i} className="play-card">
              <h3 className="play-card-title">{title}</h3>
              <p className="play-card-desc">{desc}</p>
            </div>
          ))}
        </section>

        {/* Calculator Section */}
        <section className="play-section play-calculator-section">
          <h2 className="play-subtitle">How Much Can You Earn?</h2>
          <p className="play-paragraph">
            Use the sliders below to estimate your monthly earnings.
          </p>

          <div className="play-slider-group">
            <div className="play-slider-item">
              <label className="play-label" htmlFor="ticketPrice">
                Ticket Price ($1 - $20): <strong>${ticketPrice}</strong>
              </label>
              <input
                id="ticketPrice"
                type="range"
                min="1"
                max="20"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="play-slider"
              />
            </div>

            <div className="play-slider-item">
              <label className="play-label" htmlFor="attendees">
                Attendees (1 - 25): <strong>{attendees}</strong>
              </label>
              <input
                id="attendees"
                type="range"
                min="1"
                max="25"
                value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                className="play-slider"
              />
            </div>

            <div className="play-slider-item">
              <label className="play-label" htmlFor="daPaintsPerWeek">
                DaPaints per Week (1 - 7): <strong>{daPaintsPerWeek}</strong>
              </label>
              <input
                id="daPaintsPerWeek"
                type="range"
                min="1"
                max="7"
                value={daPaintsPerWeek}
                onChange={(e) => setDaPaintsPerWeek(Number(e.target.value))}
                className="play-slider"
              />
            </div>
          </div>

          <div className="play-results-box">
            <p>
              <strong>Gross Monthly Revenue:</strong> $
              {grossMonthlyRevenue.toFixed(2)}
            </p>
            <p>
              <strong>DaPaint Fee (5%):</strong> -${platformFee.toFixed(2)}
            </p>
            <p>
              <strong>Stripe Fees (2.9% + $0.30 per ticket):</strong> -$
              {stripeFees.toFixed(2)}
            </p>
            <hr className="play-hr" />
            <p className="play-net-earnings">
              <strong>Estimated Monthly Take-Home:</strong> $
              {netMonthlyEarnings.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="play-section fadeInUp">
          <h2 className="play-title">
            Winners Don't Just Play Sports… They Profit!
          </h2>
          <form onSubmit={handleSubmit} className="play-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="play-input"
            />
            <button type="submit" className="play-button">
              Sweat, Win, Cash In!
            </button>
          </form>
        </section>
      </div>
    </>
  );
};

export default PlayOnDaPaint;
