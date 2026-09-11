import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="navbar-logo">⭐</span>
          <span className="footer-brand-name">RatePlatform</span>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} RatePlatform. All rights reserved.</p>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>·</span>
          <span>Terms of Service</span>
          <span>·</span>
          <span>Contact</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
