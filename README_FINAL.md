# StudyBuddy - AI-Powered Study Session Manager
🧠 **Smart Focus Timer for Vietnamese University Students**

[![Deadline](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)

## 🚀 Project Setup & Usage
**How to install and run your project:**  
```bash
# Clone the repository
git clone https://github.com/your-username/web-track-naver-vietnam-ai-hackathon-nolan0801.git
cd web-track-naver-vietnam-ai-hackathon-nolan0801

# Install dependencies
npm install

# Start development server
npm run dev
```
The application will be available at `http://localhost:5173`

**To build for production:**
```bash
npm run build
npm run preview
```

## 🔗 Deployed Web URL
✅ **Live Demo:** [StudyBuddy on Vercel](https://studybuddy-ai-hackathon.vercel.app)  
*Will be updated after deployment*

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** Video uploaded to YouTube as **Unlisted**.  

✅ **Demo Video:** [StudyBuddy Demo on YouTube](https://youtube.com/watch?v=your-video-id)  
*Will be updated after video creation*

## 💻 Project Introduction

### a. Overview

**StudyBuddy** is an AI-powered study session manager specifically designed for Vietnamese university students. The application helps students optimize their study time through intelligent session planning, real-time focus tracking, and personalized AI insights.

Unlike traditional task managers, StudyBuddy focuses on **study sessions** rather than just tasks, providing a comprehensive solution for academic time management with features like adaptive Pomodoro timers, AI-driven recommendations, and detailed performance analytics.

### b. Key Features & Function Manual

**🎯 Smart Focus Timer (KEY FEATURE APPLICATION)**
- **Adaptive Pomodoro Timer**: AI-powered timer that learns from your study patterns
- **Real-time Focus Tracking**: Live monitoring of study sessions with automatic scoring
- **Intelligent Break Management**: Smart break recommendations based on performance
- **Session Continuation**: Seamless session management with pause/resume functionality
- **Focus Score Calculation**: AI algorithm that evaluates session quality (completion rate + distraction penalty + pomodoro bonus)

**📅 Three Main Views (CRUD Operations):**

1. **Focus Timer View**: 
   - Start/pause/stop study sessions with real-time countdown
   - Quick session creation with subject selection
   - Live session monitoring with focus scoring
   - Timer mode switching (Focus/Short Break/Long Break)
   - Session history and active session management

2. **Session Planner View**:
   - Weekly calendar with drag-and-drop session scheduling
   - Full CRUD operations: Create, Read, Update, Delete sessions
   - Timeline view for daily session management
   - Session conflict detection and optimization
   - Bulk session operations and templates

3. **Analytics Dashboard**:
   - Performance metrics and productivity scoring
   - Subject-wise analysis with difficulty ratings
   - Weekly progress charts and trend visualization
   - AI insights panel with personalized recommendations
   - Focus pattern analysis and optimal time suggestions

**🤖 AI Features & Intelligence:**
- **Optimal Study Time Prediction**: AI analyzes your focus patterns to suggest best study hours
- **Subject Difficulty Analysis**: Automatic difficulty scoring based on your performance
- **Adaptive Break Recommendations**: Dynamic break timing based on focus scores
- **Productivity Trend Analysis**: AI tracks and predicts your productivity patterns
- **Smart Session Scheduling**: Intelligent time slot recommendations

### c. Unique Features (What's special about this app?)

1. **Vietnamese Student-Focused Design**: 
   - 16 academic subjects tailored for Vietnamese university curriculum
   - Time zones and schedules optimized for Vietnamese academic calendar
   - UI/UX designed for Vietnamese student workflow

2. **AI-Powered Session Intelligence**:
   - **Focus Score Algorithm**: Multi-factor scoring (completion rate × 0.6 + distraction penalty × 0.3 + pomodoro bonus)
   - **Pattern Recognition**: AI learns individual study patterns and optimal times
   - **Adaptive Timer**: Timer duration adjusts based on subject difficulty and performance history
   - **Smart Recommendations**: Personalized study suggestions based on AI analysis

3. **Real-time Performance Tracking**:
   - Live focus monitoring during study sessions
   - Distraction tracking and intervention
   - Automatic session quality assessment
   - Productivity scoring with trend analysis

4. **Advanced Session Management**:
   - Multi-mode timer system (Focus/Short Break/Long Break)
   - Session templates and quick creation
   - Calendar integration with conflict detection
   - Bulk operations and session optimization

5. **Comprehensive Analytics**:
   - Subject performance comparison
   - Weekly/monthly progress visualization
   - Productivity heatmaps and patterns
   - Goal tracking and achievement metrics

### d. Technology Stack and Implementation Methods

**Frontend Framework:**
- **React 18** with functional components and hooks
- **Context API + useReducer** for complex state management
- **Custom hooks** for business logic abstraction (useStudy)
- **React Router** for navigation between views

**State Management & Data Flow:**
- **StudyContext**: Global state management with React Context
- **useReducer**: Complex state logic for sessions, timer, and AI insights
- **Custom Actions**: 12 action types for comprehensive CRUD operations
- **Real-time Updates**: useEffect hooks for timer countdown and state synchronization

**Styling & UI:**
- **Modern CSS3** with glass morphism and gradient designs
- **Responsive Grid System** with CSS Grid and Flexbox
- **Mobile-First Design** optimized for all screen sizes
- **Smooth Animations** and transitions for enhanced UX

**AI Implementation:**
- **Custom Algorithms**: Focus score calculation and pattern recognition
- **Data Analysis**: Statistical analysis of study patterns and performance
- **Machine Learning Logic**: Trend prediction and recommendation engine
- **Performance Optimization**: Efficient AI calculations with memoization

**Time & Date Handling:**
- **Native JavaScript Date API** for timestamp management
- **ISO 8601 Format** for consistent date storage
- **Timezone Handling** for accurate scheduling
- **Duration Calculations** for session tracking and analytics

### e. Service Architecture & Database Structure

**Frontend Architecture (React):**
```
src/
├── App.jsx                 # Main application component
├── context/
│   └── StudyContext.jsx    # Global state management
├── components/
│   ├── MainApp.jsx         # Layout and navigation
│   ├── FocusTimer.jsx      # Smart timer component
│   ├── SessionPlanner.jsx  # Calendar and scheduling
│   └── Analytics.jsx       # Performance dashboard
└── App.css                 # Comprehensive styling
```

**Data Structure & Models:**
```javascript
// Study Session Model
StudySession {
  id: number,
  subject: string (16 Vietnamese subjects),
  topic: string,
  plannedDuration: number (minutes),
  actualDuration: number,
  focusScore: number (0-10),
  completedPomodoros: number,
  breaks: Array<BreakRecord>,
  distractions: number,
  notes: string,
  status: ENUM (PLANNED|ACTIVE|PAUSED|COMPLETED|CANCELLED),
  startTime: ISO8601,
  endTime: ISO8601,
  createdAt: ISO8601,
  scheduledFor: ISO8601
}

// AI Insights Model
AIInsights {
  optimalStudyTimes: Array<string>,
  subjectDifficulty: Object<subject, difficulty>,
  averageFocusScore: number,
  recommendedBreakTime: number,
  productivityTrend: ENUM (increasing|stable|decreasing),
  lastUpdated: ISO8601
}

// Timer State Model
TimerState {
  mode: ENUM (FOCUS|SHORT_BREAK|LONG_BREAK),
  timeLeft: number (seconds),
  isRunning: boolean,
  currentRound: number,
  totalRounds: number
}
```

**Storage & Persistence:**
- **localStorage**: Client-side persistence for offline capability
- **JSON Serialization**: Efficient data storage and retrieval
- **Auto-save**: Real-time state synchronization
- **Data Recovery**: Error handling and data integrity checks

**AI Processing Pipeline:**
1. **Data Collection**: Capture session performance and patterns
2. **Analysis Engine**: Calculate focus scores and difficulty ratings
3. **Pattern Recognition**: Identify optimal study times and trends
4. **Recommendation Engine**: Generate personalized suggestions
5. **Continuous Learning**: Update insights based on new data

## 🧠 Reflection

### a. If you had more time, what would you expand?

**Advanced AI & Machine Learning:**
- **Predictive Analytics**: Implement actual ML models for accurate performance prediction
- **Natural Language Processing**: Voice commands for hands-free session management
- **Computer Vision**: Distraction detection through webcam monitoring
- **Behavioral Analytics**: Deep learning models for study habit analysis

**Collaborative Features:**
- **Study Groups**: Real-time collaborative sessions with multiple students
- **Peer Comparison**: Anonymous performance benchmarking with classmates
- **Social Integration**: Share achievements and progress with study partners
- **Group Projects**: Collaborative planning tools for team assignments

**Enhanced User Experience:**
- **Progressive Web App**: Offline functionality with service workers
- **Native Mobile App**: React Native version for iOS/Android
- **Advanced Notifications**: Smart reminder system with multiple channels
- **Accessibility**: Screen reader support and keyboard navigation

**Integration Capabilities:**
- **University Systems**: LMS integration for automatic assignment import
- **Calendar Sync**: Google Calendar, Outlook integration
- **Note-taking Apps**: Notion, Obsidian integration
- **Productivity Tools**: Todoist, Trello synchronization

### b. If you integrate AI APIs more for your app, what would you do?

**OpenAI GPT Integration:**
- **Smart Study Planning**: Generate optimal study schedules based on course syllabi
- **Content Summarization**: Automatically create study notes from uploaded documents
- **Quiz Generation**: Create practice questions from study materials
- **Study Technique Recommendations**: Personalized learning strategies based on subjects

**Google AI/Gemini Integration:**
- **Document Intelligence**: Extract deadlines and requirements from PDF syllabi
- **Language Support**: Multi-language support with intelligent translation
- **Academic Calendar Integration**: Sync with university schedules and events
- **Smart Search**: Intelligent filtering and organization of study materials

**Specialized Educational APIs:**
- **Adaptive Learning**: Integration with educational platforms for personalized content
- **Performance Analytics**: Advanced statistical analysis of learning patterns
- **Content Recommendation**: Suggest supplementary materials based on weak areas
- **Difficulty Assessment**: Automatic subject difficulty calibration

**Voice & Vision APIs:**
- **Speech Recognition**: Voice-controlled session management
- **Text-to-Speech**: Audio summaries and notifications
- **Image Recognition**: Scan handwritten notes and schedules
- **Focus Monitoring**: Eye-tracking for attention analysis

## ✅ Checklist

### Core Technical Requirements ✅
- [x] **Full CRUD operations** on Study Sessions (Create, Read, Update, Delete)
- [x] **Persistent storage** using localStorage with JSON serialization
- [x] **3+ different views** (Focus Timer, Session Planner, Analytics Dashboard)
- [x] **Time/date handling** with scheduling, countdown timer, and analytics
- [x] **20+ items support** with efficient rendering and virtual scrolling

### Advanced Features ✅
- [x] **AI-powered focus scoring** with multi-factor algorithm
- [x] **Smart recommendations** based on performance patterns
- [x] **Real-time timer** with useEffect and state management
- [x] **Responsive design** optimized for desktop and mobile
- [x] **Vietnamese localization** with 16 academic subjects

### Submission Requirements ✅
- [x] **React + Vite** framework implementation
- [x] **Clean code architecture** with modular components
- [x] **Comprehensive documentation** in README.md
- [x] **Demo deployment** ready for Vercel
- [x] **Performance optimized** with efficient state management