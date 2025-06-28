import React, { useState } from "react";
// import "../../styles/home.css";
// import { Bg } from "../component/bg.js";
// import { Udn } from "../component/Udn.js";
import { useNavigate } from "react-router-dom";

// Auth modal styles
const authStyles = `
  .auth-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
  }
  
  .auth-modal {
	background: white;
	border-radius: 15px;
	padding: 0;
	max-width: 400px;
	width: 90%;
	max-height: 90vh;
	overflow-y: auto;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .auth-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 25px;
	border-bottom: 1px solid #eee;
  }
  
  .auth-header h2 {
	margin: 0;
	color: #333;
  }
  
  .close-btn {
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
	color: #666;
	padding: 0;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
  }
  
  .close-btn:hover {
	color: #333;
  }
  
  .auth-content {
	padding: 25px;
  }
  
  .auth-form .form-control {
	border: 2px solid #eee;
	border-radius: 8px;
	padding: 12px 15px;
	font-size: 16px;
  }
  
  .auth-form .form-control:focus {
	outline: none;
	border-color: #ffd700;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
	const styleSheet = document.createElement("style");
	styleSheet.innerText = authStyles;
	document.head.appendChild(styleSheet);
}

export const Home = () => {
	const navigate = useNavigate();
	const [showCard, setShowCard] = useState(true);
	const [showAuth, setShowAuth] = useState(false);
	const [showAds, setShowAds] = useState(false);
	const [signIn, setSignIn] = useState(true); // or true if you want sign in as default

	const toggleSignIn = () => {
		setSignIn(!signIn);
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

	const handleNavigation = (path) => {
		navigate(path);
	};

	const socialLinks = [
		{
			href: "https://tiktok.com/@LockIndapaint",
			src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/tiktok-white-icon_uzb3wz.png",
			alt: "TikTok"
		},
		{
			href: "https://x.com/LockIndapaint",
			src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/x-social-media-white-icon_wflxsb.png",
			alt: "Twitter"
		},
		{
			href: "https://instagram.com/LockIndapaint",
			src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/instagram-white-icon_ahewsm.png",
			alt: "Instagram"
		},
		{
			href: "https://snapchat.com/add/LockIndapaint",
			src: "https://res.cloudinary.com/dj2umay9c/image/upload/v1744300601/snapchat-line-icon_yxl8am.png",
			alt: "Snapchat"
		}
	];

	const footerLinks = [
		{ href: "mailto:support@dapaint.org?subject=Support%20Request&body=Please%20describe%20your%20issue", text: "Support" },
		{ href: "/terms", text: "Terms of Use" },
		{ href: "/privacy", text: "Privacy Policy" },
		{ href: "/affiliate", text: "Affiliate Disclosure" }
	];

	return (
		<>
			{/* <Bg showCard={showCard} /> */}
			<div className="scroll-container">
				{/* Header Section */}
				<header className="center-container input-pair">
					{showCard ? (
						<button
							className="btn-danger left-button rounded-pill"
							style={{ fontSize: "13px" }}
							onClick={toggleAds}
						>
							Advertise On DaPaint
						</button>
					) : (
						<button
							className="btn-danger left-button rounded-pill"
							style={{ fontSize: "13px" }}
							onClick={toggleCard}
						>
							Play On DaPaint
						</button>
					)}

					<img
						src="https://res.cloudinary.com/dj2umay9c/image/upload/v1733970532/Saturday_30th_DaPaint_Playoff-removebg-preview_yaiflb.png"
						alt="DaPaint Logo"
						className="DaPaintlogo"
						onClick={toggleCard}
						style={{ cursor: "pointer" }}
					/>

					<button
						className="right-button golden-button rounded-pill"
						style={{ fontSize: "13px" }}
						onClick={toggleAuth}
					>
						Lock In DaPaint
					</button>
				</header>

				{showAuth && (
					<div className="auth-overlay">
						<div className="auth-modal">
							<div className="auth-header">
								<h2>{signIn ? "Lock In DaPaint" : "Join DaPaint"}</h2>
								<button className="close-btn" onClick={toggleAuth}>×</button>
							</div>
							<div className="auth-content">
								<form className="auth-form">
									<div className="form-group">
										<input
											type="email"
											placeholder="Email"
											className="form-control mb-3"
											required
										/>
									</div>
									<div className="form-group">
										<input
											type="password"
											placeholder="Password"
											className="form-control mb-3"
											required
										/>
									</div>
									{!signIn && (
										<div className="form-group">
											<input
												type="password"
												placeholder="Confirm Password"
												className="form-control mb-3"
												required
											/><div className="form-group">
												<input
													type="date"
													placeholder="Birth Date"
													className="form-control mb-3"
													required
												/>
											</div>
										</div>
									)}
									<button type="submit" className="golden-button rounded-pill w-100 mb-3">
										<span className="golden-text">{signIn ? "Sign In" : "Sign Up"}</span>
									</button>
									<p className="text-center">
										{signIn ? "Don't have an account?" : "Already have an account?"}
										<a href="#" className="golden-text ml-1" onClick={toggleSignIn}>
											{signIn ? " Sign Up" : " Sign In"}
										</a>
									</p>
								</form>
							</div>
						</div>
					</div>
				)}

				{showCard && (
					<main className="m-3">
						{/* Hero Section */}
						<section className="hero-section">
							<h1 className="heroh1 text-center" style={{ marginTop: "168px" }}>
								Winners Don't Just Play…They Profit!
							</h1>

							<div className="text-center" style={{ color: "#ffffff", fontSize: "17px" }}>
								<p className="mb-3">
									Welcome to DaPaint.org—the FREE intuitive platform where players
									get paid what they're worth.
								</p>
								<button
									className="golden-button rounded-pill w-50 mt-2"
									onClick={toggleAuth}
								>
									<span className="golden-text" style={{ fontSize: "17px" }}>
										Join The Movement
									</span>
								</button>
							</div>
						</section>

						{/* About Section */}
						<section className="container text-black" style={{ marginTop: "168px" }}>
							<h2 className="text-black mb-4" style={{ textAlign: "justify" }}>
								At DaPaint.org, we're reimagining the way people compete and
								connect through sports.
							</h2>

							<div style={{ textAlign: "justify", marginBottom: "51px" }}>
								<p className="mb-3">
									DaPaint.org transforms your favorite sports into rewarding
									experiences. It's built for players who love competition and
									want to turn their skills into real income.
								</p>
								<p>
									Whether you're a player, fan, or creator, anyone can join
									DaPaint.org to play, connect, and thrive in a community where
									passion meets opportunity.
								</p>
							</div>

							{/* How It Works Section */}
							<section className="how-it-works text-center mb-5">
								<h3 className="mb-4">How It Works</h3>

								<div className="pill-container1 mx-auto bg-black mt-2 mb-3" style={{ fontSize: ".80rem" }}>
									BEAT 10 PLAYERS IN A ROW, WIN $1,000!!
								</div>

								<img
									className="w-50 mb-3"
									src="https://i.ibb.co/bgx7Nn0c/Heading2.png"
									alt="How it works diagram"
									loading="lazy"
								/>

								<p className="process-steps">
									Tap "Find Foe" → Lock In A Foe OR Add Your Own →
									Start and Win The Match → Submit Result →
									Repeat Until Win 10 games in a row to earn $1,000 in cash.
								</p>
							</section>

							{/* Earnings Section */}
							<section className="earnings-section text-center mb-5">
								<h3 className="mb-4">Weekly Gift Card Giveaway</h3>

								{/* <Udn /> */}

								<p className="m-3">
									Skilled players can earn up to $3,000/month. Let's See How
									Much You Can Earn!
								</p>

								<button
									className="golden-button rounded-pill w-50 mb-3"
									onClick={toggleAuth}
								>
									<span className="golden-text" style={{ fontSize: "17px" }}>
										Create Your Account
									</span>
								</button>
							</section>
						</section>

						{/* Footer */}
						<footer>
							{/* Social Media Links */}
							<div className="social-media-logos text-center mt-4">
								{socialLinks.map((link, index) => (
									<a
										key={index}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="hoverlink"
										style={{ textDecoration: "none", color: "inherit" }}
									>
										<img
											src={link.src}
											alt={link.alt}
											className="social-icon"
											loading="lazy"
										/>
									</a>
								))}
							</div>

							{/* Footer Links */}
							<div className="mt-3 text-gray-500 text-center" style={{ fontSize: "12px" }}>
								{footerLinks.map((link, index) => (
									<React.Fragment key={index}>
										<a
											href={link.href}
											className="hoverlink"
											style={{ textDecoration: "none", color: "inherit" }}
										>
											{link.text}
										</a>
										{index < footerLinks.length - 1 && <span> | </span>}
									</React.Fragment>
								))}
							</div>

							<div className="mt-2 text-center" style={{ fontSize: "12px" }}>
								<p style={{ fontSize: "12px", margin: 0 }}>
									© 2025 DaPaint. All Rights Reserved.
								</p>
							</div>
						</footer>
					</main>
				)}

				{showAds && (
					<main className="m-3">
						{/* Ads Hero Section */}
						<section className="hero-section">
							<h1 className="heroh1 text-center" style={{ marginTop: "168px" }}>
								Your Brand. Their Passion. Maximum Impact.
							</h1>

							<div className="text-center" style={{ color: "#ffffff", fontSize: "17px" }}>
								<p className="mb-3">
									Reach millions of engaged sports enthusiasts on DaPaint.org—where competition meets commerce.
								</p>
								<button
									className="golden-button rounded-pill w-50 mt-2"
									onClick={toggleAuth}
								>
									<span className="golden-text" style={{ fontSize: "17px" }}>
										Start Advertising Today
									</span>
								</button>
							</div>
						</section>

						{/* Why Advertise Section */}
						<section className="container text-black" style={{ marginTop: "168px" }}>
							<h2 className="text-black mb-4 text-center">
								Why Smart Brands Choose DaPaint.org
							</h2>

							<div style={{ textAlign: "justify", marginBottom: "51px" }}>
								<p className="mb-3">
									<strong>Highly Engaged Audience:</strong> Our users aren't passive viewers—they're active competitors spending hours on our platform, creating perfect conditions for meaningful brand engagement.
								</p>
								<p className="mb-3">
									<strong>Premium Demographics:</strong> Reach sports enthusiasts, content creators, and competitive gamers with disposable income who value quality products and services.
								</p>
								<p>
									<strong>Authentic Integration:</strong> Your ads don't interrupt the experience—they enhance it, appearing naturally within the competitive sports environment users love.
								</p>
							</div>

							{/* Pricing Section */}
							<section className="pricing-section text-center mb-5">
								<h3 className="mb-4">Unbeatable Value</h3>

								<div className="row">
									<div className="col-md-6">
										<div className="pricing-card p-4 mb-3" style={{ border: "2px solid #ffd700", borderRadius: "15px" }}>
											<h4 className="golden-text">$1.99 CPM</h4>
											<p>Cost Per 1,000 Impressions</p>
											<small>Industry average: $5-80 CPM</small>
										</div>
									</div>
									<div className="col-md-6">
										<div className="pricing-card p-4 mb-3" style={{ border: "2px solid #ffd700", borderRadius: "15px" }}>
											<h4 className="golden-text">$0.00199 CPV</h4>
											<p>Cost Per View</p>
											<small>Pay only for engaged viewers</small>
										</div>
									</div>
								</div>

								<div className="pill-container1 mx-auto bg-black mt-3 mb-3" style={{ fontSize: ".90rem" }}>
									SAVE UP TO 75% COMPARED TO TRADITIONAL PLATFORMS
								</div>
							</section>

							{/* Perfect For Section */}
							<section className="target-audience text-center mb-5">
								<h3 className="mb-4">Perfect For</h3>

								<div className="row">
									<div className="col-md-4 mb-3">
										<div className="audience-card p-3">
											<h5>🏢 Businesses</h5>
											<p>Sports equipment, fitness brands, energy drinks, gaming gear, and lifestyle products</p>
										</div>
									</div>
									<div className="col-md-4 mb-3">
										<div className="audience-card p-3">
											<h5>🎥 Content Creators</h5>
											<p>YouTube channels, Twitch streamers, sports influencers, and social media personalities</p>
										</div>
									</div>
									<div className="col-md-4 mb-3">
										<div className="audience-card p-3">
											<h5>🎯 Marketers</h5>
											<p>Agencies looking for high-engagement, cost-effective advertising solutions</p>
										</div>
									</div>
								</div>
							</section>

							{/* Results Section */}
							<section className="results-section text-center mb-5">
								<h3 className="mb-4">Real Results</h3>

								<div className="stats-container">
									<div className="row">
										<div className="col-md-3 mb-3">
											<div className="stat-item">
												<h4 className="golden-text">2.5M+</h4>
												<p>Monthly Active Users</p>
											</div>
										</div>
										<div className="col-md-3 mb-3">
											<div className="stat-item">
												<h4 className="golden-text">45min</h4>
												<p>Average Session Time</p>
											</div>
										</div>
										<div className="col-md-3 mb-3">
											<div className="stat-item">
												<h4 className="golden-text">8.2%</h4>
												<p>Average Click-Through Rate</p>
											</div>
										</div>
										<div className="col-md-3 mb-3">
											<div className="stat-item">
												<h4 className="golden-text">92%</h4>
												<p>Advertiser Satisfaction</p>
											</div>
										</div>
									</div>
								</div>

								<p className="m-3">
									Join hundreds of successful brands already advertising on DaPaint.org and see why we're the fastest-growing sports platform for advertisers.
								</p>

								<button
									className="golden-button rounded-pill w-50 mb-3"
									onClick={toggleAuth}
								>
									<span className="golden-text" style={{ fontSize: "17px" }}>
										Launch Your Campaign
									</span>
								</button>

								<p className="small-text mt-2">
									<small>✓ No setup fees ✓ 24/7 support ✓ Real-time analytics ✓ Flexible budgets</small>
								</p>
							</section>

							{/* CTA Section */}
							<section className="final-cta text-center mb-5">
								<div className="cta-box p-4" style={{ background: "linear-gradient(135deg, #ffd700, #ffed4e)", borderRadius: "15px" }}>
									<h3 className="text-black mb-3">Ready to Dominate Your Market?</h3>
									<p className="text-black mb-3">
										While your competitors pay premium prices elsewhere, you'll be capturing high-value customers at unbeatable rates on DaPaint.org.
									</p>
									<button
										className="btn btn-dark rounded-pill px-4 py-2"
										onClick={toggleAuth}
										style={{ fontSize: "18px", fontWeight: "bold" }}
									>
										Get Started Now - It's Free
									</button>
								</div>
							</section>
						</section>

						{/* Footer */}
						<footer>
							{/* Social Media Links */}
							<div className="social-media-logos text-center mt-4">
								{socialLinks.map((link, index) => (
									<a
										key={index}
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										className="hoverlink"
										style={{ textDecoration: "none", color: "inherit" }}
									>
										<img
											src={link.src}
											alt={link.alt}
											className="social-icon"
											loading="lazy"
										/>
									</a>
								))}
							</div>

							{/* Footer Links */}
							<div className="mt-3 text-gray-500 text-center" style={{ fontSize: "12px" }}>
								{footerLinks.map((link, index) => (
									<React.Fragment key={index}>
										<a
											href={link.href}
											className="hoverlink"
											style={{ textDecoration: "none", color: "inherit" }}
										>
											{link.text}
										</a>
										{index < footerLinks.length - 1 && <span> | </span>}
									</React.Fragment>
								))}
							</div>

							<div className="mt-2 text-center" style={{ fontSize: "12px" }}>
								<p style={{ fontSize: "12px", margin: 0 }}>
									© 2025 DaPaint. All Rights Reserved.
								</p>
							</div>
						</footer>
					</main>
				)}
			</div>
		</>
	);
};