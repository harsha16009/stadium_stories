import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import LatestNews from './components/LatestNews'
import Players from './components/Players'
import Matches from './components/Matches'
import SeriesList from './components/SeriesList'
import Login from './components/Login'
import Booking from './components/Booking'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('HOME')
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  // Check for existing session
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setActiveSection('HOME');
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setActiveSection('LOGIN');
  }

  const renderSection = () => {

    switch (activeSection) {
      case 'HOME':
        return <Hero />;
      case 'MATCHES':
        return (
          <section id="matches-section" className="main-section standalone">
            <div className="section-title">
              <h2>CRICKET MATCHES</h2>
              <p>Schedule, Live Scores & Results</p>
            </div>
            <Matches />
          </section>
        );
      case 'SERIES':
        return (
          <section id="series-section" className="main-section standalone">
            <div className="section-title">
              <h2>CRICKET SERIES</h2>
              <p>Upcoming and Ongoing Tournaments</p>
            </div>
            <SeriesList />
          </section>
        );
      case 'NEWS':
        return (
          <section id="news-section" className="main-section standalone">
            <LatestNews />
          </section>
        );
      case 'TEAM':
        return (
          <section id="team-section" className="main-section standalone">
            <Players />
          </section>
        );
      case 'LOGIN':
        return <Login onLoginSuccess={handleLogin} />;
      case 'BOOKING':
        return <Booking />;
      default:
        return <Hero />;
    }
  }

  return (
    <div className="app-container">
      {isLoggedIn && (
        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}
      <main className="content-area">
        {renderSection()}
      </main>
    </div>
  )
}

export default App
