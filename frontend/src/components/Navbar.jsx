import React from 'react';
import LiveScore from './LiveScore';
import './Navbar.css';

const Navbar = ({ activeSection, setActiveSection, isLoggedIn, onLogout }) => {
  const handleNavClick = (section, e) => {
    e.preventDefault();
    setActiveSection(section);
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    if (onLogout) onLogout();
  };

  return (
    <div className="header-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="top-bar-right">
          <div className="social-icons">
            <i className="fab fa-facebook-f"></i>
            <i className="fab fa-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-youtube"></i>
          </div>
          <div className="app-download">
            <span>Download Our App</span>
            <img src="https://www.royalchallengers.com/themes/custom/rcb/assets/images/google-play.png" alt="Google Play" />
            <img src="https://www.royalchallengers.com/themes/custom/rcb/assets/images/app-store.png" alt="App Store" />
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="main-navbar animate-fade-in-down">
        <div className="navbar-logo animate-pulse-subtle">
          <img src="/assets/stadium-stories-logo.jpg" alt="Stadium Stories Logo" />
          <span className="play-bold">STADIUM STORIES</span>
        </div>

        <ul className="nav-links">
          <li>
            <a
              href="#home-section"
              className={activeSection === 'HOME' ? 'active' : ''}
              onClick={(e) => handleNavClick('HOME', e)}
            >
              HOME
            </a>
          </li>
          <li>
            <a
              href="#matches-section"
              className={activeSection === 'MATCHES' ? 'active' : ''}
              onClick={(e) => handleNavClick('MATCHES', e)}
            >
              MATCHES
            </a>
          </li>
          <li>
            <a
              href="#news-section"
              className={activeSection === 'NEWS' ? 'active' : ''}
              onClick={(e) => handleNavClick('NEWS', e)}
            >
              NEWS
            </a>
          </li>
          <li>
            <a
              href="#series-section"
              className={activeSection === 'SERIES' ? 'active' : ''}
              onClick={(e) => handleNavClick('SERIES', e)}
            >
              SERIES
            </a>
          </li>
          <li>
            <a
              href="#team-section"
              className={activeSection === 'TEAM' ? 'active' : ''}
              onClick={(e) => handleNavClick('TEAM', e)}
            >
              TEAM
            </a>
          </li>
          <li>
            <a
              href="#booking-section"
              className={activeSection === 'BOOKING' ? 'active' : ''}
              onClick={(e) => handleNavClick('BOOKING', e)}
            >
              TICKET BOOKING
            </a>
          </li>
          <li><a href="#">FIXTURES</a></li>
          <li><a href="#">ECHOES OF FANS</a></li>
          <li className="dropdown">
            <a href="#" className="more-btn">MORE <span className="arrow-down">⌄</span></a>
            <ul className="dropdown-menu">
              {!isLoggedIn ? (
                <li><a href="#" onClick={(e) => handleNavClick('LOGIN', e)}>LOGIN</a></li>
              ) : (
                <li><a href="#" onClick={handleLogoutClick}>LOGOUT</a></li>
              )}
            </ul>
          </li>
        </ul>

        <div className="navbar-actions">
          <div className="cart-icon">
            <i className="fas fa-shopping-bag"></i>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
