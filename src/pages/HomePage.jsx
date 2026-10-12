import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const pricingData = {
    gujaratiMediumGujaratBoard: [
      { class: '1-5', hourly: '₹150-250' },
      { class: '6-8', hourly: '₹200-350' },
      { class: '9-10', hourly: '₹300-500' },
      { class: '11-12', hourly: '₹400-650' },
    ],
    gujaratiMediumCBSE: [
      { class: '1-5', hourly: '₹200-300' },
      { class: '6-8', hourly: '₹300-450' },
      { class: '9-10', hourly: '₹400-650' },
      { class: '11-12', hourly: '₹550-850' },
    ],
    englishMediumCBSE: [
      { class: '1-5', hourly: '₹250-400' },
      { class: '6-8', hourly: '₹350-550' },
      { class: '9-10', hourly: '₹500-800' },
      { class: '11-12 (All)', hourly: '₹800-1200' },
    ],
    englishMediumICSE: [
      { class: '1-5', hourly: '₹300-450' },
      { class: '6-8', hourly: '₹400-650' },
      { class: '9-10', hourly: '₹600-1000' },
      { class: '11-12 (All)', hourly: '₹900-1350' },
    ],
    englishMediumIB: [
      { class: '11-12 (All)', hourly: '₹1100-1600' },
    ],
    jeeNEET: [
      { subject: 'Maths', hourly: '₹1200-1800' },
      { subject: 'Physics', hourly: '₹1200-1800' },
      { subject: 'Chemistry', hourly: '₹1000-1500' },
      { subject: 'Biology', hourly: '₹900-1400' },
    ],
  };

  return (
    <div className="home-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="container">
          <h1 className="logo">Advait Home Tutoring & Consultancy</h1>
          <div className="nav-links">
            <Link to="/student-register" className="btn btn-primary">Student Register</Link>
            <Link to="/tutor-register" className="btn btn-secondary">Tutor Register</Link>
            <Link to="/student-login" className="btn btn-tertiary">Student Login</Link>
            <Link to="/tutor-login" className="btn btn-tertiary">Tutor Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2>Find Your Perfect Tutor</h2>
          <p>Connect with verified tutors in Ahmedabad. Genuine leads, transparent pricing, professional service.</p>
          <div className="hero-buttons">
            <Link to="/student-register" className="btn btn-large">Get a Tutor</Link>
            <Link to="/tutor-register" className="btn btn-large btn-secondary">Become a Tutor</Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <h2>Transparent Pricing</h2>
          <p>No bargaining. Clear rates for every board and medium.</p>

          <div className="pricing-grid">
            {/* Gujarati Medium - Gujarat Board */}
            <div className="pricing-card">
              <h3>Gujarati Medium - Gujarat Board</h3>
              <div className="price-list">
                {pricingData.gujaratiMediumGujaratBoard.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.class}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gujarati Medium - CBSE */}
            <div className="pricing-card">
              <h3>Gujarati Medium - CBSE</h3>
              <div className="price-list">
                {pricingData.gujaratiMediumCBSE.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.class}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* English Medium - CBSE */}
            <div className="pricing-card">
              <h3>English Medium - CBSE</h3>
              <div className="price-list">
                {pricingData.englishMediumCBSE.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.class}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* English Medium - ICSE */}
            <div className="pricing-card">
              <h3>English Medium - ICSE</h3>
              <div className="price-list">
                {pricingData.englishMediumICSE.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.class}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* English Medium - IB */}
            <div className="pricing-card">
              <h3>English Medium - IB</h3>
              <div className="price-list">
                {pricingData.englishMediumIB.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.class}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* JEE/NEET */}
            <div className="pricing-card">
              <h3>JEE/NEET Coaching</h3>
              <div className="price-list">
                {pricingData.jeeNEET.map((item, idx) => (
                  <div key={idx} className="price-item">
                    <span className="class">{item.subject}</span>
                    <span className="rate">{item.hourly}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pricing-note">
            <p><strong>Note:</strong> Custom rates available for special requirements. Contact us via WhatsApp for personalized quotes.</p>
            <p><strong>Service Charge:</strong> ₹200 one-time from students (after demo & confirmation)</p>
            <p><strong>Tutor Commission:</strong> 50% of first income (flexible payment options)</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>✓ Verified Tutors</h3>
              <p>All tutors are personally verified by our team</p>
            </div>
            <div className="feature-card">
              <h3>✓ Transparent Pricing</h3>
              <p>No hidden charges. Clear rates displayed upfront</p>
            </div>
            <div className="feature-card">
              <h3>✓ Free Demo</h3>
              <p>Try a free demo before committing</p>
            </div>
            <div className="feature-card">
              <h3>✓ Professional Matching</h3>
              <p>We manually match students with the best tutors</p>
            </div>
            <div className="feature-card">
              <h3>✓ Flexible Scheduling</h3>
              <p>Choose timing that works for you</p>
            </div>
            <div className="feature-card">
              <h3>✓ Quality Assurance</h3>
              <p>We ensure both student and tutor satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Advait Home Tutoring & Consultancy. All rights reserved.</p>
          <p>Based in Ahmedabad | Covering all boards and mediums</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
