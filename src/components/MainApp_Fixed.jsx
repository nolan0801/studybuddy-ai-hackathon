import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import FocusTimer from './FocusTimer';
import SessionPlanner from './SessionPlanner';
import Analytics from './Analytics';

function MainApp() {
  const [activeView, setActiveView] = useState('timer');

  const renderActiveView = () => {
    switch (activeView) {
      case 'timer':
        return <FocusTimer />;
      case 'planner':
        return <SessionPlanner />;
      case 'analytics':
        return <Analytics />;
      default:
        return <FocusTimer />;
    }
  };

  return (
    <div className="main-app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <div className="logo-text">
              <h1>StudyBuddy</h1>
              <span>AI Study Session Manager</span>
            </div>
          </div>
          
          <nav className="main-nav">
            <button 
              className={`nav-btn ${activeView === 'timer' ? 'active' : ''}`}
              onClick={() => setActiveView('timer')}
            >
              <span className="nav-icon">⏱️</span>
              Focus Timer
            </button>
            <button 
              className={`nav-btn ${activeView === 'planner' ? 'active' : ''}`}
              onClick={() => setActiveView('planner')}
            >
              <span className="nav-icon">📅</span>
              Session Planner
            </button>
            <button 
              className={`nav-btn ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveView('analytics')}
            >
              <span className="nav-icon">📊</span>
              Analytics
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {renderActiveView()}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>StudyBuddy - Smart Focus Timer for Vietnamese University Students</p>
          <p>Built with AI for optimal study session management</p>
        </div>
      </footer>
    </div>
  );
}

export default MainApp;