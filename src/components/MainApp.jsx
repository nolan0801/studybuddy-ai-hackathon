import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import FocusTimer from './FocusTimer';
import SessionPlanner from './SessionPlanner';
import SessionPlannerMonth from './SessionPlannerMonth';
import Analytics from './Analytics';
import { Play, Calendar, BarChart3, Brain, Settings } from 'lucide-react';

function MainApp() {
  const { sessions, activeSession } = useStudy();
  const [activeView, setActiveView] = useState('timer');

  return (
    <div className="main-app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🧠</div>
            <div className="logo-text">
              <h1>StudyBuddy</h1>
              <span>AI Study Session Manager</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <button
          onClick={() => setActiveView('timer')}
          className={`nav-btn ${activeView === 'timer' ? 'active' : ''}`}
        >
          <Play size={20} />
          <span>Focus Timer</span>
          {activeSession && <div className="active-indicator"></div>}
        </button>
        
        <button
          onClick={() => setActiveView('planner')}
          className={`nav-btn ${activeView === 'planner' ? 'active' : ''}`}
        >
          <Calendar size={20} />
          <span>Planner</span>
        </button>
        
        <button
          onClick={() => setActiveView('analytics')}
          className={`nav-btn ${activeView === 'analytics' ? 'active' : ''}`}
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeView === 'timer' && <FocusTimer />}
        {activeView === 'planner' && <SessionPlannerMonth />}
        {activeView === 'analytics' && <Analytics />}
      </main>

      {/* Performance Analytics Sidebar */}
      <aside className="performance-analytics-sidebar">
        <div className="analytics-header">
          <Brain size={20} />
          <h3>Performance Analytics</h3>
        </div>
        <PerformanceAnalyticsSummary />
      </aside>
    </div>
  );
}

function PerformanceAnalyticsSummary() {
  const { performanceAnalytics } = useStudy();

  return (
    <div className="performance-analytics">
      <div className="insight-card">
        <h4>🎯 Optimal Study Times</h4>
        <div className="time-slots">
          {performanceAnalytics.optimalStudyTimes.map((time, index) => (
            <span key={index} className="time-slot">{time}</span>
          ))}
        </div>
      </div>

      <div className="insight-card">
        <h4>📊 Your Focus Score</h4>
        <div className="focus-score">
          <div className="score-circle">
            <span className="score-number">{performanceAnalytics.averageFocusScore.toFixed(1)}</span>
            <span className="score-max">/10</span>
          </div>
          <p className="score-trend">
            Trend: <span className={`trend ${performanceAnalytics.productivityTrend}`}>
              {performanceAnalytics.productivityTrend}
            </span>
          </p>
        </div>
      </div>

      <div className="insight-card">
        <h4>💡 Smart Recommendations</h4>
        <div className="recommendations">
          <div className="recommendation">
            <span className="rec-emoji">⏰</span>
            <span>Take {performanceAnalytics.recommendedBreakTime}min breaks</span>
          </div>
          <div className="recommendation">
            <span className="rec-emoji">🔥</span>
            <span>Your peak hours: {performanceAnalytics.optimalStudyTimes[0] || '9:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainApp;