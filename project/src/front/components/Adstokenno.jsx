import React from "react";

export const Adstokenno = ({ toggleAuth }) => {
  return (
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
                <small>Industry average: $5-$80 CPM</small>
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
    </main>
  );
};