import React, { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { Play, Pause, Square, RotateCcw, Coffee, Brain, Target } from 'lucide-react';

function FocusTimer() {
  const { 
    activeSession, 
    currentTimer, 
    sessions, 
    dispatch, 
    ACTIONS, 
    SESSION_STATUS, 
    TIMER_MODES,
    SUBJECTS 
  } = useStudy();

  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    topic: '',
    plannedDuration: 25
  });

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (currentTimer.isRunning && currentTimer.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({
          type: ACTIONS.UPDATE_TIMER,
          payload: { timeLeft: currentTimer.timeLeft - 1 }
        });
      }, 1000);
    } else if (currentTimer.timeLeft === 0 && currentTimer.isRunning) {
      // Timer finished
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [currentTimer.isRunning, currentTimer.timeLeft]);

  const handleTimerComplete = () => {
    // Play sound notification (if enabled)
    // Update session with actual time
    if (activeSession) {
      const actualMinutes = Math.ceil((activeSession.plannedDuration * 60 - currentTimer.timeLeft) / 60);
      dispatch({
        type: ACTIONS.UPDATE_SESSION,
        payload: {
          ...activeSession,
          actualDuration: actualMinutes,
          status: SESSION_STATUS.COMPLETED,
          endTime: new Date().toISOString(),
          completedPomodoros: activeSession.completedPomodoros + 1
        }
      });
    }

    // Auto-start break or finish session
    if (currentTimer.mode === TIMER_MODES.FOCUS) {
      const isLongBreak = currentTimer.currentRound % 4 === 0;
      startBreak(isLongBreak);
    } else {
      // Break finished, prepare for next focus session
      dispatch({
        type: ACTIONS.UPDATE_TIMER,
        payload: {
          mode: TIMER_MODES.FOCUS,
          timeLeft: 25 * 60,
          currentRound: currentTimer.currentRound + 1,
          isRunning: false
        }
      });
    }
  };

  const startSession = (session) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_SESSION, payload: session });
    dispatch({
      type: ACTIONS.UPDATE_SESSION,
      payload: {
        ...session,
        status: SESSION_STATUS.ACTIVE,
        startTime: new Date().toISOString()
      }
    });
    dispatch({
      type: ACTIONS.UPDATE_TIMER,
      payload: {
        mode: TIMER_MODES.FOCUS,
        timeLeft: session.plannedDuration * 60,
        isRunning: true,
        currentRound: 1
      }
    });
  };

  const pauseTimer = () => {
    dispatch({
      type: ACTIONS.UPDATE_TIMER,
      payload: { isRunning: false }
    });
  };

  const resumeTimer = () => {
    dispatch({
      type: ACTIONS.UPDATE_TIMER,
      payload: { isRunning: true }
    });
  };

  const stopSession = () => {
    if (activeSession) {
      dispatch({
        type: ACTIONS.UPDATE_SESSION,
        payload: {
          ...activeSession,
          status: SESSION_STATUS.CANCELLED
        }
      });
    }
    dispatch({ type: ACTIONS.RESET_TIMER });
  };

  const startBreak = (isLong = false) => {
    const breakDuration = isLong ? 15 : 5;
    dispatch({
      type: ACTIONS.UPDATE_TIMER,
      payload: {
        mode: isLong ? TIMER_MODES.LONG_BREAK : TIMER_MODES.SHORT_BREAK,
        timeLeft: breakDuration * 60,
        isRunning: true
      }
    });
  };

  const createQuickSession = () => {
    const newSession = {
      id: Date.now(),
      subject: sessionForm.subject,
      topic: sessionForm.topic,
      plannedDuration: parseInt(sessionForm.plannedDuration),
      actualDuration: 0,
      focusScore: 0,
      completedPomodoros: 0,
      breaks: [],
      distractions: 0,
      notes: '',
      status: SESSION_STATUS.PLANNED,
      startTime: null,
      endTime: null,
      createdAt: new Date().toISOString(),
      scheduledFor: new Date().toISOString()
    };

    dispatch({ type: ACTIONS.ADD_SESSION, payload: newSession });
    setShowSessionModal(false);
    setSessionForm({ subject: '', topic: '', plannedDuration: 25 });
    startSession(newSession);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    switch (currentTimer.mode) {
      case TIMER_MODES.FOCUS: return '#667eea';
      case TIMER_MODES.SHORT_BREAK: return '#10b981';
      case TIMER_MODES.LONG_BREAK: return '#f59e0b';
      default: return '#667eea';
    }
  };

  const plannedSessions = sessions.filter(s => s.status === SESSION_STATUS.PLANNED);

  return (
    <div className="focus-timer">
      {/* Timer Display */}
      <div className="timer-container">
        <div className="timer-mode">
          <span className={`mode-indicator ${currentTimer.mode.toLowerCase()}`}>
            {currentTimer.mode === TIMER_MODES.FOCUS && '🎯 Focus Time'}
            {currentTimer.mode === TIMER_MODES.SHORT_BREAK && '☕ Short Break'}
            {currentTimer.mode === TIMER_MODES.LONG_BREAK && '🛋️ Long Break'}
          </span>
        </div>

        <div className="timer-circle" style={{ borderColor: getTimerColor() }}>
          <div className="timer-content">
            <div className="timer-display">
              {formatTime(currentTimer.timeLeft)}
            </div>
            {activeSession && (
              <div className="session-info">
                <h3>{activeSession.topic}</h3>
                <span className="session-subject">{activeSession.subject}</span>
              </div>
            )}
          </div>
        </div>

        <div className="timer-controls">
          {!currentTimer.isRunning ? (
            <button onClick={resumeTimer} className="control-btn primary" disabled={!activeSession}>
              <Play size={24} />
              Start
            </button>
          ) : (
            <button onClick={pauseTimer} className="control-btn secondary">
              <Pause size={24} />
              Pause
            </button>
          )}
          
          <button onClick={stopSession} className="control-btn danger" disabled={!activeSession}>
            <Square size={24} />
            Stop
          </button>
          
          <button 
            onClick={() => dispatch({ type: ACTIONS.RESET_TIMER })} 
            className="control-btn secondary"
          >
            <RotateCcw size={24} />
            Reset
          </button>
        </div>

        <div className="timer-stats">
          <div className="stat">
            <span className="stat-label">Round</span>
            <span className="stat-value">{currentTimer.currentRound}/4</span>
          </div>
          <div className="stat">
            <span className="stat-label">Mode</span>
            <span className="stat-value">{currentTimer.mode.split('_')[0]}</span>
          </div>
        </div>
      </div>

      {/* Session Selection */}
      <div className="session-selection">
        <div className="section-header">
          <h3>📚 Ready to Study</h3>
          <button 
            onClick={() => setShowSessionModal(true)}
            className="btn-primary small"
          >
            + Quick Session
          </button>
        </div>

        {plannedSessions.length === 0 ? (
          <div className="empty-state">
            <Coffee size={48} />
            <h4>No planned sessions</h4>
            <p>Create a quick session or plan your study schedule</p>
            <button 
              onClick={() => setShowSessionModal(true)}
              className="btn-primary"
            >
              Create First Session
            </button>
          </div>
        ) : (
          <div className="session-grid">
            {plannedSessions.slice(0, 6).map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <h4>{session.topic}</h4>
                  <span className="session-duration">{session.plannedDuration}min</span>
                </div>
                <div className="session-subject">{session.subject}</div>
                <button 
                  onClick={() => startSession(session)}
                  className="session-start-btn"
                  disabled={!!activeSession}
                >
                  <Play size={16} />
                  Start
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Session Modal */}
      {showSessionModal && (
        <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚀 Create Quick Session</h3>
              <button onClick={() => setShowSessionModal(false)}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label>Subject</label>
                <select 
                  value={sessionForm.subject}
                  onChange={(e) => setSessionForm({...sessionForm, subject: e.target.value})}
                >
                  <option value="">Choose subject</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Topic</label>
                <input 
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => setSessionForm({...sessionForm, topic: e.target.value})}
                  placeholder="What will you study?"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input 
                  type="number"
                  value={sessionForm.plannedDuration}
                  onChange={(e) => setSessionForm({...sessionForm, plannedDuration: e.target.value})}
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowSessionModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={createQuickSession}
                className="btn-primary"
                disabled={!sessionForm.subject || !sessionForm.topic}
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusTimer;