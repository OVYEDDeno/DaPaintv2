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
  const [showFullForm, setShowFullForm] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
    howDidYouHear: "",
    signupLocation: "form1" // Auto-checkbox for this page
  });
  const [formErrors, setFormErrors] = useState({});

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

    // Create layered emoji positions with z-index for behind/in front of text
  const emojiPositions = React.useMemo(() => {
    const positions = [];
    
    // Calculate emoji size - 68% bigger than before
    const baseEmojiSize = isMobile ? 20 : 40; // Previous base emoji size
    const emojiSize = Math.floor(baseEmojiSize * 1.68); // 68% bigger
    
    // Create a wide grid that spans the full title width
    const gridCols = 8; // More columns for wider distribution
    const gridRows = Math.ceil(emojiCount / gridCols);
    
    // Calculate spacing to ensure proper margin between emojis
    const emojiSizeInPercent = (emojiSize / 16) * 2; // Conversion to percentage
    const minSpacing = 8; // Minimum spacing in percentage
    const totalSpacing = emojiSizeInPercent + minSpacing;
    
    const sectionWidth = Math.max(100 / gridCols, totalSpacing);
    const sectionHeight = Math.max((isMobile ? 40 : 60) / gridRows, totalSpacing);
    
    for (let i = 0; i < emojiCount; i++) {
      const row = Math.floor(i / gridCols);
      const col = i % gridCols;
      
      // Add small randomness but keep emojis in their designated sections
      const randomX = getRandomInt(2, Math.max(2, sectionWidth - totalSpacing - 2));
      const randomY = getRandomInt(2, Math.max(2, sectionHeight - totalSpacing - 2));
      
      // Simple z-index distribution - just alternate between behind and front
      const zIndex = (i % 2 === 0) ? 1 : 3; // Even = behind, odd = front
      
              positions.push({
          top: `${row * sectionHeight + randomY}%`,
          left: `${col * sectionWidth + randomX}%`,
          fontSize: `${emojiSize}px`,
          rotate: `${getRandomInt(-25, 25)}deg`,
          zIndex: zIndex,
        });
    }
    
    return positions;
  }, [emojiCount, isMobile]);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setFormData(prev => ({ ...prev, email: emailValue }));
    setError("");
  };

  const checkEmailExists = async (email) => {
    // TODO: Replace with actual API endpoint when available
    // For now, simulate email check
    try {
      // const response = await fetch(`${process.env.BACKEND_URL}/api/check-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // const result = await response.json();
      // return result.exists;
      
      // Simulate email check - replace with actual API call
      return false; // Assume email doesn't exist for now
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleEmailBlur = async () => {
    if (email && email.includes("@")) {
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
      if (!exists) {
        setShowFullForm(true);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!showFullForm) {
      // Just email submission
      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      setSubmitted(true);
      setError("");
      return;
    }

    // Full form submission
    const errors = {};
    if (!formData.name) errors.name = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.zipcode) errors.zipcode = "Zipcode is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.birthday) errors.birthday = "Birthday is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setError("");
        // Redirect to Play token page
        window.location.href = '/playtoken';
      } else {
        if (result.errors) {
          setFormErrors(result.errors);
        } else {
          setError(result.msg || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError("System error. Please try again.");
    }
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
                  zIndex: emojiPositions[i].zIndex,
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
          <form onSubmit={handleSubmit} className={`play-form ${showFullForm ? 'play-form-expanded' : ''}`}>
            {!showFullForm ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  className="play-input"
                />
                <button type="submit" className="play-button">
                  Lock In DaPaint
                </button>
              </>
            ) : (
              <div className="play-full-form">
                {/* Username and Phone */}
                <div className="play-input-pair">
                  <input
                    type="text"
                    name="name"
                    placeholder="Username/Creative alias"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                </div>
                {formErrors.name && <p className="play-error">{formErrors.name}</p>}
                {formErrors.phone && <p className="play-error">{formErrors.phone}</p>}

                {/* Email and Password */}
                <div className="play-input-pair">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                </div>
                {formErrors.email && <p className="play-error">{formErrors.email}</p>}
                {formErrors.password && <p className="play-error">{formErrors.password}</p>}

                {/* City and Zipcode */}
                <div className="play-input-pair">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="Zipcode"
                    value={formData.zipcode}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                </div>
                {formErrors.city && <p className="play-error">{formErrors.city}</p>}
                {formErrors.zipcode && <p className="play-error">{formErrors.zipcode}</p>}

                {/* Birthday */}
                <div className="play-input-single">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                </div>
                {formErrors.birthday && <p className="play-error">{formErrors.birthday}</p>}

                {/* How did you hear about us */}
                <div className="play-input-single">
                  <select
                    name="howDidYouHear"
                    value={formData.howDidYouHear}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  >
                    <option value="">How did you hear about us?</option>
                    <option value="social_media">Social Media</option>
                    <option value="friend">Friend/Family</option>
                    <option value="search">Search Engine</option>
                    <option value="advertisement">Advertisement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Hidden signup location */}
                <input type="hidden" name="signupLocation" value="form1" />

                <button type="submit" className="play-button-full">
                  Lock In DaPaint
                </button>
              </div>
            )}
          </form>
          {error && <p className="play-error">{error}</p>}
          {submitted && !showFullForm && (
            <p className="play-success">
              Check your inbox to verify and start earning!
            </p>
          )}
          {!showFullForm && (
            <p className="play-small-text">
              Already signed up? Enter your email to unlock your account.
            </p>
          )}
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
