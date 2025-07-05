import React from "react";
import { Footer } from "./Footer";
import { DaPaintLockIn } from "./DaPaintLockIn";

export const Hometokenno = ({ toggleAuth, toggleDaPaintCreate, isAuthenticated }) => {
  return (
    <main className="m-3">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="heroh1 text-center" style={{ marginTop: "168px" }}>
          {isAuthenticated
            ? "Welcome Back, Champion!"
            : "Winners Don't Just Play…They Profit!"
          }
        </h1>

        <div className="text-center" style={{ color: "#ffffff", fontSize: "17px" }}>
          <p className="mb-3">
            {isAuthenticated
              ? "Ready to dominate the competition and earn your rewards?"
              : "Welcome to DaPaint.org—the FREE intuitive platform where players get paid what they're worth."
            }
          </p>
          {!isAuthenticated && (
            <button
              className="golden-button rounded-pill w-50 mt-2"
              onClick={toggleAuth}
            >
              <span className="golden-text" style={{ fontSize: "17px" }}>
                Join The Movement
              </span>
            </button>
          )}
          {isAuthenticated && (
            <>
              <button
                className="golden-button rounded-pill w-50 mt-2"
                onClick={toggleDaPaintCreate}
              >
                <span className="golden-text" style={{ fontSize: "17px" }}>
                  Create a DaPaint
                </span>
              </button>
              {/* <DaPaintLockIn /> */}
            </>
          )}          
          </div>
      </section>

      {/* About Section */}
      <section className="container text-black" style={{ marginTop: "168px" }}>
        <h2 className="text-black mb-4" style={{ textAlign: "justify" }}>
          {isAuthenticated
            ? "Your Dashboard - Track Your Success"
            : "At DaPaint.org, we're reimagining the way people compete and connect through sports."
          }
        </h2>

        {isAuthenticated ? (
          // Authenticated user content
          <div>
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="stat-card p-3 text-center" style={{ border: "2px solid #ffd700", borderRadius: "15px" }}>
                  <h4 className="golden-text">5</h4>
                  <p>Games Won</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-3 text-center" style={{ border: "2px solid #ffd700", borderRadius: "15px" }}>
                  <h4 className="golden-text">$125</h4>
                  <p>Total Earnings</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card p-3 text-center" style={{ border: "2px solid #ffd700", borderRadius: "15px" }}>
                  <h4 className="golden-text">3</h4>
                  <p>Win Streak</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                className="golden-button rounded-pill w-50 mb-3"
                onClick={() => {/* Navigate to games */ }}
              >
                <span className="golden-text" style={{ fontSize: "17px" }}>
                  Continue Playing
                </span>
              </button>
            </div>
          </div>
        ) : (
          // Non-authenticated user content
          <div>
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
          </div>
        )}
      </section>
      {/* <Footer /> */}
    </main>
  );
};