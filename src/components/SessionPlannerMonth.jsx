import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { Calendar, Clock, Plus, Edit2, Trash2, Play, ChevronLeft, ChevronRight } from 'lucide-react';

function SessionPlannerMonth() {
  const { sessions, dispatch, ACTIONS, SESSION_STATUS, SUBJECTS } = useStudy();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState({
    subject: '',
    topic: '',
    plannedDuration: 25,
    scheduledFor: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00'
  });

  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.scheduledFor).toISOString().split('T')[0];
    return sessionDate === selectedDate;
  });

  const handleCreateSession = () => {
    const scheduledDateTime = new Date(`${sessionForm.scheduledFor}T${sessionForm.scheduledTime}`);
    
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
      scheduledFor: scheduledDateTime.toISOString()
    };

    if (editingSession) {
      dispatch({
        type: ACTIONS.UPDATE_SESSION,
        payload: { ...editingSession, ...newSession, id: editingSession.id }
      });
    } else {
      dispatch({ type: ACTIONS.ADD_SESSION, payload: newSession });
    }

    resetForm();
  };

  const resetForm = () => {
    setSessionForm({
      subject: '',
      topic: '',
      plannedDuration: 25,
      scheduledFor: selectedDate,
      scheduledTime: '09:00'
    });
    setShowModal(false);
    setEditingSession(null);
  };

  const handleEditSession = (session) => {
    const scheduledDate = new Date(session.scheduledFor);
    setSessionForm({
      subject: session.subject,
      topic: session.topic,
      plannedDuration: session.plannedDuration,
      scheduledFor: scheduledDate.toISOString().split('T')[0],
      scheduledTime: scheduledDate.toTimeString().slice(0, 5)
    });
    setEditingSession(session);
    setShowModal(true);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      dispatch({ type: ACTIONS.DELETE_SESSION, payload: sessionId });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case SESSION_STATUS.PLANNED: return '#3b82f6';
      case SESSION_STATUS.ACTIVE: return '#f59e0b';
      case SESSION_STATUS.COMPLETED: return '#10b981';
      case SESSION_STATUS.CANCELLED: return '#ef4444';
      default: return '#6b7280';
    }
  };

  // New month calendar logic
  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from Sunday of the week containing first day
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days = [];
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const monthDays = getMonthDays();

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  return (
    <div className="session-planner">
      {/* Header */}
      <div className="planner-header">
        <div className="header-left">
          <h2>📅 Study Planner - Month View</h2>
          <div className="date-info">
            <Calendar size={16} />
            <span>{new Date(selectedDate).toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          New Session
        </button>
      </div>

      {/* Month Navigation */}
      <div className="month-navigation">
        <button onClick={() => navigateMonth(-1)} className="nav-btn">
          <ChevronLeft size={20} />
        </button>
        <h3 className="month-title">
          {currentMonth.toLocaleDateString('en', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => navigateMonth(1)} className="nav-btn">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Month Calendar */}
      <div className="month-calendar">
        {/* Day headers */}
        <div className="calendar-headers">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-header">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="calendar-grid">
          {monthDays.map((day, index) => {
            const dayString = day.toISOString().split('T')[0];
            const daySessions = sessions.filter(s => 
              new Date(s.scheduledFor).toISOString().split('T')[0] === dayString
            );
            const isSelected = dayString === selectedDate;
            const isToday = dayString === new Date().toISOString().split('T')[0];
            const isOtherMonth = !isCurrentMonth(day);

            return (
              <div 
                key={index} 
                className={`calendar-day-month ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}`}
                onClick={() => setSelectedDate(dayString)}
              >
                <div className="day-number-month">{day.getDate()}</div>
                <div className="day-sessions-month">
                  {daySessions.slice(0, 2).map(session => (
                    <div 
                      key={session.id} 
                      className="mini-session-month"
                      style={{ backgroundColor: `${getStatusColor(session.status)}` }}
                      title={`${session.subject}: ${session.topic}`}
                    >
                      <span className="session-time-month">
                        {new Date(session.scheduledFor).toLocaleTimeString('en', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  ))}
                  {daySessions.length > 2 && (
                    <div className="more-sessions-month">+{daySessions.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Sessions - Same as original */}
      <div className="daily-sessions">
        <h3>
          Sessions for {new Date(selectedDate).toLocaleDateString('vi-VN', { 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        {todaySessions.length === 0 ? (
          <div className="empty-day">
            <Calendar size={48} />
            <h4>No sessions planned</h4>
            <p>Add your first study session for this day</p>
            <button onClick={() => setShowModal(true)} className="btn-primary">
              Plan Session
            </button>
          </div>
        ) : (
          <div className="session-timeline">
            {todaySessions
              .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
              .map(session => (
                <div key={session.id} className="timeline-session">
                  <div className="session-time">
                    {new Date(session.scheduledFor).toLocaleTimeString('en', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  
                  <div className="session-content">
                    <div className="session-main">
                      <h4>{session.topic}</h4>
                      <div className="session-meta">
                        <span className="subject">{session.subject}</span>
                        <span className="duration">
                          <Clock size={14} />
                          {session.plannedDuration}min
                        </span>
                        <span 
                          className="status"
                          style={{ color: getStatusColor(session.status) }}
                        >
                          {session.status.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="session-actions">
                      {session.status === SESSION_STATUS.PLANNED && (
                        <button 
                          onClick={() => {/* Start session logic */}}
                          className="action-btn start"
                          title="Start session"
                        >
                          <Play size={14} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditSession(session)}
                        className="action-btn edit"
                        title="Edit session"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteSession(session.id)}
                        className="action-btn delete"
                        title="Delete session"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Session Modal - Same as original */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSession ? 'Edit Session' : 'Plan New Session'}</h3>
              <button onClick={resetForm}>×</button>
            </div>
            
            <div className="modal-content">
              <div className="form-row">
                <div className="form-group">
                  <label>Subject *</label>
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
                  <label>Duration (minutes) *</label>
                  <input 
                    type="number"
                    value={sessionForm.plannedDuration}
                    onChange={(e) => setSessionForm({...sessionForm, plannedDuration: e.target.value})}
                    min="5"
                    max="180"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Topic *</label>
                <input 
                  type="text"
                  value={sessionForm.topic}
                  onChange={(e) => setSessionForm({...sessionForm, topic: e.target.value})}
                  placeholder="What will you study?"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date *</label>
                  <input 
                    type="date"
                    value={sessionForm.scheduledFor}
                    onChange={(e) => setSessionForm({...sessionForm, scheduledFor: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Time *</label>
                  <input 
                    type="time"
                    value={sessionForm.scheduledTime}
                    onChange={(e) => setSessionForm({...sessionForm, scheduledTime: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleCreateSession}
                className="btn-primary"
                disabled={!sessionForm.subject || !sessionForm.topic}
              >
                {editingSession ? 'Update Session' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SessionPlannerMonth;