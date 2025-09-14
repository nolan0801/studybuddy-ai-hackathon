import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Study Session Status
const SESSION_STATUS = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Timer Modes
const TIMER_MODES = {
  FOCUS: 'FOCUS',
  SHORT_BREAK: 'SHORT_BREAK',
  LONG_BREAK: 'LONG_BREAK'
};

// Action Types
const ACTIONS = {
  ADD_SESSION: 'ADD_SESSION',
  UPDATE_SESSION: 'UPDATE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  START_SESSION: 'START_SESSION',
  PAUSE_SESSION: 'PAUSE_SESSION',
  COMPLETE_SESSION: 'COMPLETE_SESSION',
  UPDATE_TIMER: 'UPDATE_TIMER',
  RESET_TIMER: 'RESET_TIMER',
  SET_ACTIVE_SESSION: 'SET_ACTIVE_SESSION',
  ADD_FOCUS_RECORD: 'ADD_FOCUS_RECORD',
  UPDATE_AI_INSIGHTS: 'UPDATE_AI_INSIGHTS',
  LOAD_SAVED_DATA: 'LOAD_SAVED_DATA'
};

// Subjects for Vietnamese students
const SUBJECTS = [
  'Toán học', 'Vật lý', 'Hóa học', 'Sinh học',
  'Văn học', 'Tiếng Anh', 'Lịch sử', 'Địa lý',
  'Tin học', 'Kinh tế', 'Kế toán', 'Marketing',
  'Luật', 'Tâm lý học', 'Triết học', 'Khác'
];

// Initial State
const initialState = {
  sessions: [
    {
      id: 1,
      subject: 'Toán học',
      topic: 'Giải tích 1 - Giới hạn hàm số',
      plannedDuration: 25, // minutes
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
    },
    {
      id: 2,
      subject: 'Tiếng Anh',
      topic: 'IELTS Reading Practice',
      plannedDuration: 50,
      actualDuration: 45,
      focusScore: 8.5,
      completedPomodoros: 2,
      breaks: [
        { startTime: '2024-01-15T10:25:00', duration: 5 },
        { startTime: '2024-01-15T11:15:00', duration: 10 }
      ],
      distractions: 2,
      notes: 'Improved reading speed significantly',
      status: SESSION_STATUS.COMPLETED,
      startTime: '2024-01-15T10:00:00',
      endTime: '2024-01-15T11:30:00',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  activeSession: null,
  currentTimer: {
    mode: TIMER_MODES.FOCUS,
    timeLeft: 25 * 60, // seconds
    isRunning: false,
    currentRound: 1,
    totalRounds: 4
  },
  focusRecords: [
    {
      id: 1,
      sessionId: 2,
      timestamp: '2024-01-15T10:15:00',
      focusLevel: 9,
      activity: 'reading'
    }
  ],
  aiInsights: {
    optimalStudyTimes: ['09:00', '14:00', '20:00'],
    subjectDifficulty: {
      'Toán học': 8.5,
      'Tiếng Anh': 6.0,
      'Vật lý': 9.0
    },
    averageFocusScore: 7.5,
    recommendedBreakTime: 10,
    productivityTrend: 'increasing',
    lastUpdated: new Date().toISOString()
  },
  settings: {
    defaultFocusTime: 25,
    defaultShortBreak: 5,
    defaultLongBreak: 15,
    soundEnabled: true,
    notificationsEnabled: true,
    autoStartBreaks: false,
    aiSuggestionsEnabled: true
  }
};

// AI Helper Functions
const calculateFocusScore = (session) => {
  if (!session.actualDuration) return 0;
  
  const completionRate = session.actualDuration / session.plannedDuration;
  const distractionPenalty = Math.max(0, 1 - (session.distractions * 0.1));
  const pomodoroBonus = session.completedPomodoros * 0.1;
  
  let score = (completionRate * 0.6 + distractionPenalty * 0.3 + pomodoroBonus) * 10;
  return Math.min(10, Math.max(0, score));
};

const generateAIInsights = (sessions) => {
  const completedSessions = sessions.filter(s => s.status === SESSION_STATUS.COMPLETED);
  
  if (completedSessions.length === 0) {
    return initialState.aiInsights;
  }

  // Calculate optimal study times based on completed sessions
  const timeSlots = {};
  completedSessions.forEach(session => {
    if (session.startTime) {
      const hour = new Date(session.startTime).getHours();
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      if (!timeSlots[timeSlot]) timeSlots[timeSlot] = [];
      timeSlots[timeSlot].push(session.focusScore);
    }
  });

  const optimalTimes = Object.entries(timeSlots)
    .map(([time, scores]) => ({
      time,
      avgScore: scores.reduce((a, b) => a + b, 0) / scores.length
    }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3)
    .map(item => item.time);

  // Calculate subject difficulty
  const subjectStats = {};
  completedSessions.forEach(session => {
    if (!subjectStats[session.subject]) {
      subjectStats[session.subject] = [];
    }
    subjectStats[session.subject].push(session.focusScore);
  });

  const subjectDifficulty = {};
  Object.entries(subjectStats).forEach(([subject, scores]) => {
    subjectDifficulty[subject] = 10 - (scores.reduce((a, b) => a + b, 0) / scores.length);
  });

  // Calculate average focus score
  const avgFocusScore = completedSessions.reduce((sum, s) => sum + s.focusScore, 0) / completedSessions.length;

  return {
    optimalStudyTimes: optimalTimes.length > 0 ? optimalTimes : ['09:00', '14:00', '20:00'],
    subjectDifficulty,
    averageFocusScore: avgFocusScore,
    recommendedBreakTime: Math.max(5, Math.min(15, Math.round(avgFocusScore))),
    productivityTrend: avgFocusScore > 7 ? 'increasing' : avgFocusScore > 5 ? 'stable' : 'decreasing',
    lastUpdated: new Date().toISOString()
  };
};

// Reducer Function
function studyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_SESSION:
      const newSessions = [...state.sessions, action.payload];
      return {
        ...state,
        sessions: newSessions,
        aiInsights: generateAIInsights(newSessions)
      };

    case ACTIONS.UPDATE_SESSION:
      const updatedSessions = state.sessions.map(session =>
        session.id === action.payload.id 
          ? { ...session, ...action.payload, focusScore: calculateFocusScore({...session, ...action.payload}) }
          : session
      );
      return {
        ...state,
        sessions: updatedSessions,
        aiInsights: generateAIInsights(updatedSessions)
      };

    case ACTIONS.DELETE_SESSION:
      const filteredSessions = state.sessions.filter(session => session.id !== action.payload);
      return {
        ...state,
        sessions: filteredSessions,
        aiInsights: generateAIInsights(filteredSessions)
      };

    case ACTIONS.START_SESSION:
      return {
        ...state,
        activeSession: action.payload,
        currentTimer: {
          ...state.currentTimer,
          isRunning: true,
          timeLeft: action.payload.plannedDuration * 60
        }
      };

    case ACTIONS.PAUSE_SESSION:
      return {
        ...state,
        currentTimer: {
          ...state.currentTimer,
          isRunning: false
        }
      };

    case ACTIONS.COMPLETE_SESSION:
      const completedSessions = state.sessions.map(session =>
        session.id === state.activeSession?.id
          ? { ...session, status: SESSION_STATUS.COMPLETED, endTime: new Date().toISOString() }
          : session
      );
      return {
        ...state,
        sessions: completedSessions,
        activeSession: null,
        currentTimer: {
          ...initialState.currentTimer
        },
        aiInsights: generateAIInsights(completedSessions)
      };

    case ACTIONS.UPDATE_TIMER:
      return {
        ...state,
        currentTimer: {
          ...state.currentTimer,
          ...action.payload
        }
      };

    case ACTIONS.RESET_TIMER:
      return {
        ...state,
        currentTimer: {
          ...initialState.currentTimer
        },
        activeSession: null
      };

    case ACTIONS.SET_ACTIVE_SESSION:
      return {
        ...state,
        activeSession: action.payload
      };

    case ACTIONS.ADD_FOCUS_RECORD:
      return {
        ...state,
        focusRecords: [...state.focusRecords, action.payload]
      };

    case ACTIONS.LOAD_SAVED_DATA:
      return {
        ...state,
        ...action.payload,
        aiInsights: generateAIInsights(action.payload.sessions || state.sessions)
      };

    default:
      return state;
  }
}

// Context
const StudyContext = createContext();

// Provider Component
export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(studyReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('studyBuddyData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Load saved data into state
        dispatch({
          type: ACTIONS.LOAD_SAVED_DATA,
          payload: {
            sessions: parsedData.sessions || initialState.sessions,
            focusRecords: parsedData.focusRecords || initialState.focusRecords,
            settings: parsedData.settings || initialState.settings
          }
        });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      sessions: state.sessions,
      focusRecords: state.focusRecords,
      aiInsights: state.aiInsights,
      settings: state.settings
    };
    localStorage.setItem('studyBuddyData', JSON.stringify(dataToSave));
  }, [state.sessions, state.focusRecords, state.aiInsights, state.settings]);

  const value = {
    ...state,
    dispatch,
    ACTIONS,
    SESSION_STATUS,
    TIMER_MODES,
    SUBJECTS
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
}

// Custom Hook
export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}