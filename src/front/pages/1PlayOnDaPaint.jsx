import React, { useState } from "react";

// Emojis for overlay
const BASE_EMOJI_SET = [
  // Hand/people emojis (with skin tone support)
  '🙌', '👏', '🤸', '🤾', 
  // Face/smileys (no skin tone)
  '😁', '🤩', '🤑', '🥳', '😎', '🎉', '🎊',
  // Sports
  '🏀', '⚽', '🏆', '🏈', '🎾', '🏐', '🏓', '🏸', '🏅', '🥇',
  // Money
  '💸', '💰',
  // Fire
  '🔥'
];

// Skin tone modifiers
const SKIN_TONES = [
  '\u{1F3FB}', // light
  '\u{1F3FC}', // medium-light
  '\u{1F3FD}', // medium
  '\u{1F3FE}', // medium-dark
  '\u{1F3FF}'  // dark
];

// Emojis that support skin tones
const SKIN_TONE_EMOJIS = new Set(['🙌', '👏', '🤸', '🤾', '🤑']);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomEmojis(count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    let emoji = BASE_EMOJI_SET[getRandomInt(0, BASE_EMOJI_SET.length - 1)];
    if (SKIN_TONE_EMOJIS.has(emoji)) {
      // Randomly pick a skin tone
      const skinTone = SKIN_TONES[getRandomInt(0, SKIN_TONES.length - 1)];
      // Combine emoji and skin tone using code points
      emoji = emoji + skinTone;
      // Use String.fromCodePoint for correct rendering
      emoji = String.fromCodePoint(...[...emoji].map(c => c.codePointAt(0)));
    }
    arr.push(emoji);
  }
  return arr;
}

const PlayOnDaPaint = () => {
  const [email, setEmail] = useState("");
  const [showFullForm, setShowFullForm] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    zipcode: "",
    phone: "",
    birthday: "",
    howDidYouHear: "",
    signupLocation: "form1"
  });
  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // Calculator state
  const [ticketPrice, setTicketPrice] = useState(20);
  const [attendees, setAttendees] = useState(25);
  const [daPaintsPerWeek, setDaPaintsPerWeek] = useState(7);

  const WEEKS_PER_MONTH = 4;
  const PLATFORM_FEE_RATE = 0.05;
  const STRIPE_PERCENT = 0.029;
  const STRIPE_FLAT_FEE = 0.3;

  // Emoji overlay logic - always 4 emojis
  const emojiCount = 4;
  const emojis = React.useMemo(() => getRandomEmojis(emojiCount), []);

    // Create layered emoji positions with z-index for behind/in front of text
  const emojiPositions = React.useMemo(() => {
    const positions = [];
    // Calculate emoji size - 68% bigger than before
    const baseEmojiSize = 40;
    const emojiSize = Math.floor(baseEmojiSize * 1.68);
    // Create a wide grid that spans the full title width
    const gridCols = 8; // More columns for wider distribution
    const gridRows = Math.ceil(emojiCount / gridCols);
    // Calculate spacing to ensure proper margin between emojis
    const emojiSizeInPercent = (emojiSize / 16) * 2; // Conversion to percentage
    const minSpacing = 8; // Minimum spacing in percentage
    const totalSpacing = emojiSizeInPercent + minSpacing;
    const sectionWidth = Math.max(100 / gridCols, totalSpacing);
    const sectionHeight = Math.max(60 / gridRows, totalSpacing);
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
  }, [emojiCount]);

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    setFormData(prev => ({ ...prev, email: emailValue }));
    setError("");
    setShowFullForm(false);
    setShowSignInForm(false);
    setForgotMsg("");
  };

  const checkEmailExists = async (email) => {
    // Simulate: if email is 'A@a.a', treat as existing
    if (email.trim().toLowerCase() === 'a@a.a') return true;
    return false;
  };

  const handleEmailBlur = async () => {
    if (email && email.includes("@")) {
      const exists = await checkEmailExists(email);
      if (exists) {
        setShowSignInForm(true);
        setShowFullForm(false);
      } else {
        setShowFullForm(true);
        setShowSignInForm(false);
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: "" }));
    setForgotMsg("");
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setFormErrors({ password: "Password is required" });
      return;
    }
    // TODO: Replace with real sign-in logic
    // Simulate success
    window.location.href = '/playtoken';
  };

  const handleForgotPassword = async () => {
    // TODO: Replace with real API call
    setForgotMsg("If this email exists, a reset link has been sent.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only handle sign-up here
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
    // TODO: Replace with real signup logic
    window.location.href = '/playtoken';
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
          <form
            onSubmit={
              showSignInForm
                ? handleSignIn
                : showFullForm
                ? handleSubmit
                : handleSubmit // allow submit on just email for initial CTA
            }
            className={`play-form ${
              showFullForm || showSignInForm ? 'play-form-expanded' : ''
            }`}
          >
            {/* Email input always shown first */}
            <div className="play-input-wrapper" style={{ position: "relative", marginBottom: 24 }}>
              {(email || document.activeElement?.id === "play-email-input") && (
                <label
                  htmlFor="play-email-input"
                  className="play-input-label"
                  style={{
                    position: "absolute",
                    top: -18,
                    left: 8,
                    fontSize: 13,
                    color: "#555",
                    background: "#fff",
                    padding: "0 4px",
                    zIndex: 2,
                    transition: "all 0.2s"
                  }}
                >
                  Email
                </label>
              )}
              <input
                id="play-email-input"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className="play-input"
                required
                disabled={showFullForm || showSignInForm}
                onFocus={e => e.target.select()}
                style={{ width: "100%" }}
              />
              {/* Example text */}
              {(document.activeElement?.id === "play-email-input" || email === "") && (
                <span
                  className="play-input-example"
                  style={{
                    position: "absolute",
                    left: 10,
                    bottom: -18,
                    fontSize: 12,
                    color: "#888"
                  }}
                >
                  Example: your@email.com
                </span>
              )}
            </div>
            {/* Restore Lock In DaPaint button for initial email-only state */}
            {!(showFullForm || showSignInForm) && (
              <button type="submit" className="play-button-full" style={{ marginTop: 12 }}>
                Lock In DaPaint
              </button>
            )}
            {/* Show sign-in form if email exists */}
            {showSignInForm && (
              <div className="play-signin-form">
                <div className="play-signin-row">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  />
                  <button
                    type="submit"
                    className="play-button-full"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  >
                    Sign In
                  </button>
                </div>
                {formErrors.password && (
                  <p className="play-error">{formErrors.password}</p>
                )}
                <button
                  type="button"
                  className="play-forgot-btn"
                  style={{ marginTop: 8 }}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
                {forgotMsg && <p className="play-success">{forgotMsg}</p>}
              </div>
            )}
            {/* Show sign-up form if email does not exist */}
            {showFullForm && (
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
                    disabled
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

                {/* Birthday and How did you hear about us - now inline */}
                <div className="play-input-pair">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                  <input
                    type="text"
                    name="howDidYouHear"
                    placeholder="How did you hear about us?"
                    value={formData.howDidYouHear}
                    onChange={handleFormChange}
                    className="play-form-input"
                    required
                  />
                </div>
                {formErrors.birthday && <p className="play-error">{formErrors.birthday}</p>}
                {formErrors.howDidYouHear && <p className="play-error">{formErrors.howDidYouHear}</p>}

                <input type="hidden" name="signupLocation" value="form1" />
                <button type="submit" className="play-button-full">
                  Lock In DaPaint
                </button>
              </div>
            )}
          </form>
          {error && <p className="play-error">{error}</p>}
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
                Ticket Price: <strong>${ticketPrice}</strong>
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
                Attendees: <strong>{attendees}</strong>
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
                DaPaints per Week: <strong>{daPaintsPerWeek}</strong>
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
