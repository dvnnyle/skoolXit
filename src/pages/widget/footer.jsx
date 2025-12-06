import React from 'react';
import './footer.css';
import logo from '../../assets/day17logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <a href="https://dvnny.no" target="_blank" rel="noopener noreferrer" className="footer-brand-link">
            <h2 className="footer-brand">DVNNY.NO</h2>
          </a>
          <p className="footer-subtitle">ALL-ROUNDER</p>
          <img src={logo} alt="Day17 Logo" className="footer-logo-img" style={{marginTop: '70px'}} />
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">NAVIGATION</h3>
          <nav className="footer-nav">
            <a href="#home" className="footer-link">HOME</a>
            <a href="#about" className="footer-link">ABOUT</a>
            <a href="#projects" className="footer-link">PROJECTS</a>
            <a href="#contact" className="footer-link">CONTACT</a>
          </nav>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">U WANT ME?</h3>
          <nav className="footer-nav">
            <a href="https://www.linkedin.com/in/danny-nguyen-le-98808221b?originalSubdomain=no" target="_blank" rel="noopener noreferrer" className="footer-link">LINKEDIN</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-link">TWITTER X</a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-link">FACEBOOK</a>
            <a href="https://github.com/dvnnyle" target="_blank" rel="noopener noreferrer" className="footer-link">GITHUB</a>
          </nav>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p className="footer-credit">Website by Danny Nguyen Le</p>
        <p className="footer-signature">DAY17</p>
        <p className="footer-copyright">Copyright © 2025</p>
      </div>
    </footer>
  );
};

export default Footer;