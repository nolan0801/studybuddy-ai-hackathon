import React from 'react';
import { useStudy } from '../context/StudyContext';
import { BarChart3, TrendingUp, Clock, Target, Brain, Trophy } from 'lucide-react';

function Analytics() {
  const { sessions, aiInsights, focusRecords } = useStudy();

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
  const totalSessions = sessions.length;
  const totalStudyTime = completedSessions.reduce((sum, s) => sum + s.actualDuration, 0);
  const averageSessionTime = completedSessions.length > 0 
    ? Math.round(totalStudyTime / completedSessions.length) 
    : 0;

  // Calculate subject performance
  const subjectStats = {};
  completedSessions.forEach(session => {
    if (!subjectStats[session.subject]) {
      subjectStats[session.subject] = {
        sessions: 0,
        totalTime: 0,
        totalFocus: 0,
        avgFocus: 0
      };
    }
    subjectStats[session.subject].sessions++;
    subjectStats[session.subject].totalTime += session.actualDuration;
    subjectStats[session.subject].totalFocus += session.focusScore;
    subjectStats[session.subject].avgFocus = 
      subjectStats[session.subject].totalFocus / subjectStats[session.subject].sessions;
  });

  // Weekly progress (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    
    const daySessions = completedSessions.filter(session => {
      const sessionDate = new Date(session.endTime);
      return sessionDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toLocaleDateString('en', { weekday: 'short' }),
      sessions: daySessions.length,
      minutes: daySessions.reduce((sum, s) => sum + s.actualDuration, 0),
      avgFocus: daySessions.length > 0 
        ? daySessions.reduce((sum, s) => sum + s.focusScore, 0) / daySessions.length 
        : 0
    };
  });

  // Study time distribution by hour
  const hourlyDistribution = {};
  completedSessions.forEach(session => {
    if (session.startTime) {
      const hour = new Date(session.startTime).getHours();
      if (!hourlyDistribution[hour]) hourlyDistribution[hour] = 0;
      hourlyDistribution[hour] += session.actualDuration;
    }
  });

  const getPerformanceColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getProductivityLevel = (avgFocus) => {
    if (avgFocus >= 8) return { level: 'Excellent', emoji: '🔥', color: '#10b981' };
    if (avgFocus >= 6) return { level: 'Good', emoji: '👍', color: '#f59e0b' };
    if (avgFocus >= 4) return { level: 'Average', emoji: '😐', color: '#f59e0b' };
    return { level: 'Needs Work', emoji: '💪', color: '#ef4444' };
  };

  const productivity = getProductivityLevel(aiInsights.averageFocusScore);

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Study Analytics</h2>
        <p>Insights into your learning patterns and performance</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <BarChart3 size={24} />
          </div>
          <div className="metric-content">
            <h3>{completedSessions.length}</h3>
            <p>Completed Sessions</p>
            <span className="metric-change">
              +{sessions.filter(s => s.status === 'PLANNED').length} planned
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</h3>
            <p>Total Study Time</p>
            <span className="metric-change">
              Avg: {averageSessionTime}min/session
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <Brain size={24} />
          </div>
          <div className="metric-content">
            <h3>{aiInsights.averageFocusScore.toFixed(1)}/10</h3>
            <p>Average Focus Score</p>
            <span 
              className="metric-change"
              style={{ color: productivity.color }}
            >
              {productivity.emoji} {productivity.level}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3 style={{ color: aiInsights.productivityTrend === 'increasing' ? '#10b981' : '#f59e0b' }}>
              {aiInsights.productivityTrend}
            </h3>
            <p>Productivity Trend</p>
            <span className="metric-change">
              Last 7 days analysis
            </span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="chart-section">
        <h3>📈 Weekly Progress</h3>
        <div className="weekly-chart">
          {last7Days.map((day, index) => (
            <div key={index} className="chart-day">
              <div className="chart-bars">
                <div 
                  className="chart-bar sessions"
                  style={{ 
                    height: `${Math.max(day.sessions * 20, 5)}px`,
                    backgroundColor: '#667eea'
                  }}
                  title={`${day.sessions} sessions`}
                ></div>
                <div 
                  className="chart-bar minutes"
                  style={{ 
                    height: `${Math.max(day.minutes / 5, 5)}px`,
                    backgroundColor: '#10b981'
                  }}
                  title={`${day.minutes} minutes`}
                ></div>
                <div 
                  className="chart-bar focus"
                  style={{ 
                    height: `${Math.max(day.avgFocus * 8, 5)}px`,
                    backgroundColor: '#f59e0b'
                  }}
                  title={`${day.avgFocus.toFixed(1)} avg focus`}
                ></div>
              </div>
              <span className="chart-label">{day.date}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
            <span>Sessions</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
            <span>Minutes</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>Focus Score</span>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="subject-performance">
        <h3>📚 Subject Performance</h3>
        <div className="subject-list">
          {Object.entries(subjectStats).map(([subject, stats]) => (
            <div key={subject} className="subject-item">
              <div className="subject-info">
                <h4>{subject}</h4>
                <div className="subject-meta">
                  <span>{stats.sessions} sessions</span>
                  <span>{stats.totalTime} minutes</span>
                </div>
              </div>
              <div className="subject-score">
                <div className="score-circle" style={{ color: getPerformanceColor(stats.avgFocus) }}>
                  {stats.avgFocus.toFixed(1)}
                </div>
              </div>
              <div className="subject-progress">
                <div 
                  className="progress-bar"
                  style={{ 
                    width: `${(stats.avgFocus / 10) * 100}%`,
                    backgroundColor: getPerformanceColor(stats.avgFocus)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="ai-insights-panel">
        <h3>🤖 AI Insights & Recommendations</h3>
        
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <Target size={20} />
              <h4>Optimal Study Times</h4>
            </div>
            <div className="time-recommendations">
              {aiInsights.optimalStudyTimes.map((time, index) => (
                <span key={index} className="time-slot optimal">
                  {time}
                </span>
              ))}
            </div>
            <p>Based on your focus patterns, these are your peak performance hours.</p>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <Clock size={20} />
              <h4>Break Recommendations</h4>
            </div>
            <div className="break-info">
              <span className="break-time">{aiInsights.recommendedBreakTime} minutes</span>
              <p>Recommended break duration between study sessions</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <Trophy size={20} />
              <h4>Study Streak</h4>
            </div>
            <div className="streak-info">
              <span className="streak-number">
                {last7Days.filter(day => day.sessions > 0).length}
              </span>
              <p>Days studied this week</p>
            </div>
          </div>
        </div>

        <div className="smart-recommendations">
          <h4>💡 Smart Recommendations</h4>
          <div className="recommendation-list">
            {aiInsights.averageFocusScore < 6 && (
              <div className="recommendation">
                <span className="rec-emoji">🎯</span>
                <p>Try shorter 20-minute sessions to improve focus</p>
              </div>
            )}
            {aiInsights.productivityTrend === 'decreasing' && (
              <div className="recommendation">
                <span className="rec-emoji">⚡</span>
                <p>Consider taking longer breaks or studying at different times</p>
              </div>
            )}
            {Object.keys(subjectStats).length > 3 && (
              <div className="recommendation">
                <span className="rec-emoji">📚</span>
                <p>Focus on your challenging subjects during peak hours</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;