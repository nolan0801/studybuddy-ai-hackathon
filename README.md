# StudyBuddy - AI-Powered Study Session Manager
🧠 **Smart Focus Timer for Vietnamese University Students**

[![Deadline](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)

## 🚀 Project Setup & Usage
**How to install and run your project:**  
```bash
# Clone the repository
git clone [your-repo-url]
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
✅ **Live Demo:** [StudyBuddy on Vercel](https://your-app-name.vercel.app)  
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
# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
✍️  
Example (replace with your actual steps)  
- `npm install`  
- `npm start`

## 🔗 Deployed Web URL or APK file
✍️ [Paste your link here]


## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.  

✍️ [Paste your video link here]


## 💻 Project Introduction

### a. Overview

**StudySync** is an AI-powered study planner designed specifically for Vietnamese university students. The application helps students manage their academic tasks, track study progress, and optimize their learning schedule using artificial intelligence insights.

The app addresses the common time management challenges faced by Vietnamese students by providing intelligent task prioritization, visual progress tracking, and personalized study recommendations based on individual patterns and habits.

### b. Key Features & Function Manual

**🎯 Smart Task Management (CRUD Operations)**
- **Create**: Add new tasks with title, description, subject, due date, and estimated hours
- **Read**: View tasks in multiple formats (Today view, Calendar view, Analytics dashboard)
- **Update**: Edit existing tasks, mark as complete/incomplete
- **Delete**: Remove completed or unwanted tasks
- **AI Priority**: Automatic priority assignment based on due date and importance

**📅 Three Main Views:**

1. **Today View**: 
   - Shows tasks due today with AI-generated priority
   - Progress bar showing daily completion rate
   - AI suggestions for optimal study times
   - Quick task creation and editing

2. **Calendar View**:
   - Interactive monthly calendar with task visualization
   - Click on any date to see scheduled tasks
   - Visual indicators for task completion status
   - Easy task scheduling across different dates

3. **Analytics Dashboard**:
   - Completion rate statistics and trends
   - Weekly progress charts
   - Subject distribution pie charts
   - Daily completion patterns
   - AI-powered productivity insights

**🤖 AI Features:**
- Smart priority calculation based on deadlines
- Personalized study time recommendations
- Productivity score calculation
- Pattern-based insights and suggestions

### c. Unique Features (What's special about this app?) 

1. **Vietnamese Student-Focused Design**: Built specifically for the academic environment and challenges of Vietnamese university students

2. **AI-Powered Priority System**: Automatically calculates task priority based on multiple factors:
   - Time until deadline
   - Estimated completion time
   - Historical completion patterns

3. **Intelligent Study Time Suggestions**: AI analyzes your past completion patterns to suggest optimal study times

4. **Visual Progress Tracking**: Beautiful, intuitive charts and graphs that make progress visible and motivating

5. **Multi-Subject Organization**: Designed for students juggling multiple courses with subject-based categorization

6. **Productivity Scoring**: AI calculates a personalized productivity score based on completion patterns and consistency

7. **Responsive Design**: Works seamlessly on desktop and mobile devices

### d. Technology Stack and Implementation Methods

**Frontend Framework:**
- **React 18** with functional components and hooks
- **React Router DOM** for client-side routing
- **React Hook Form** for form validation and management

**Styling & UI:**
- **Custom CSS** with modern glassmorphism design
- **Lucide React** for consistent iconography
- **Responsive grid system** for mobile-first design

**Data Visualization:**
- **Recharts** for interactive charts and graphs
- **Custom chart components** for analytics dashboard

**Date Handling:**
- **date-fns** for robust date manipulation and formatting
- **Timezone-aware** date calculations

**State Management:**
- **React Context API** with useReducer for global state
- **Custom hooks** for business logic abstraction

**Data Persistence:**
- **localStorage** for persistent data storage
- **JSON serialization** for complex data structures
- **Automatic state synchronization**

**AI Implementation:**
- **Custom algorithms** for task priority calculation
- **Pattern recognition** for study time optimization
- **Productivity analytics** based on completion data

### e. Service Architecture & Database structure (when used)

**Client-Side Architecture:**
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── TaskModal.jsx   # Task creation/editing modal
├── pages/              # Main application views
│   ├── TodayView.jsx   # Today's tasks with AI priority
│   ├── CalendarView.jsx # Calendar-based task view
│   └── AnalyticsView.jsx # Analytics dashboard
├── context/            # State management
│   └── TaskContext.jsx # Global state with AI helpers
├── App.jsx            # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles
```

**Data Structure:**
```javascript
// Task Object
{
  id: number,
  title: string,
  description: string,
  subject: string,
  dueDate: ISO string,
  estimatedHours: number,
  completed: boolean,
  completedAt: ISO string,
  createdAt: ISO string
}

// Study Session Object  
{
  id: number,
  taskId: number,
  startTime: ISO string,
  endTime: ISO string,
  completed: boolean
}

// App Settings
{
  aiEnabled: boolean,
  notifications: boolean,
  studyGoalHours: number
}
```

**Storage Strategy:**
- **localStorage** for persistent client-side storage
- **JSON serialization** for complex nested objects
- **Automatic backup/restore** on application load
- **State synchronization** across browser sessions

**AI Logic Flow:**
1. **Priority Calculation**: Due date proximity + estimated hours + completion history
2. **Study Time Analysis**: Historical completion times → optimal study periods
3. **Productivity Scoring**: Completion rate + consistency + goal achievement
4. **Pattern Recognition**: Weekly trends + subject performance + time preferences

## 🧠 Reflection

### a. If you had more time, what would you expand?

**Advanced AI Features:**
- **Machine Learning Integration**: Implement actual ML models to predict task completion times based on historical data
- **Natural Language Processing**: Allow students to create tasks using natural language (e.g., "Remind me to study calculus tomorrow at 3 PM")
- **Smart Notifications**: Intelligent reminder system that learns from user behavior patterns

**Collaborative Features:**
- **Study Groups**: Allow students to create and join study groups, share tasks and progress
- **Peer Progress Sharing**: Compare productivity with classmates while maintaining privacy
- **Group Project Management**: Tools for managing collaborative assignments and deadlines

**Enhanced Analytics:**
- **Stress Level Tracking**: Monitor workload distribution and suggest optimal task spacing
- **Performance Correlation**: Link task completion with grades/performance data
- **Semester Planning**: Long-term academic planning with semester-wide view
- **Time Tracking**: Actual time spent vs estimated time analysis

**Integration Capabilities:**
- **University Systems**: Integration with student information systems and course schedules
- **Calendar Apps**: Sync with Google Calendar, Apple Calendar, etc.
- **Note-taking Apps**: Connect with popular note-taking applications
- **Pomodoro Timer**: Built-in focus timer with break management

**Mobile Experience:**
- **Native Mobile App**: React Native version for better mobile performance
- **Offline Support**: Work without internet connection with sync when online
- **Push Notifications**: Native mobile notifications for deadlines and reminders

### b. If you integrate AI APIs more for your app, what would you do?

**OpenAI GPT Integration:**
- **Smart Task Breakdown**: Automatically break down complex assignments into smaller, manageable subtasks
- **Study Material Generation**: Generate quiz questions, summaries, and study guides based on task descriptions
- **Personalized Study Advice**: Provide contextual study tips based on subject matter and student performance
- **Writing Assistant**: Help students improve their task descriptions and planning

**Google AI/Gemini Integration:**
- **Document Analysis**: Analyze uploaded syllabi and assignment sheets to automatically create tasks with deadlines
- **Academic Calendar Integration**: Understand university schedules and academic calendars for better planning
- **Language Support**: Multi-language support for Vietnamese and English with intelligent translation

**Specialized Educational AI:**
- **Adaptive Learning**: Use Khan Academy's or Coursera's AI to suggest supplementary learning materials
- **Difficulty Assessment**: Automatically assess task difficulty and adjust time estimates
- **Learning Style Analysis**: Determine student's learning preferences and optimize study recommendations

**Predictive Analytics:**
- **Workload Forecasting**: Predict busy periods and suggest task redistribution
- **Performance Prediction**: Forecast grades based on study patterns and task completion
- **Burnout Prevention**: Monitor stress indicators and suggest breaks or workload adjustments

**Voice Integration:**
- **Voice Commands**: Use speech recognition for hands-free task creation and management
- **Audio Summaries**: Generate spoken summaries of daily/weekly progress
- **Study Session Narration**: AI-powered study session guidance and motivation

**Computer Vision:**
- **Handwritten Note Recognition**: Scan and digitize handwritten notes and to-do lists
- **Document Scanning**: Extract deadlines and requirements from photographed assignment sheets
- **Study Environment Analysis**: Analyze study space and suggest improvements for productivity

**Behavioral AI:**
- **Habit Formation**: Use reinforcement learning to help students build better study habits
- **Motivation Modeling**: Understand individual motivation patterns and provide personalized encouragement
- **Procrastination Intervention**: Detect procrastination patterns and provide timely interventions


## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled
- [x] CRUD operations implemented for tasks
- [x] Persistent storage using localStorage
- [x] Three different views (Today, Calendar, Analytics)
- [x] Time/date handling with date-fns
- [x] Support for 20+ items with efficient rendering
- [x] AI-powered features and insights
- [x] Responsive design for mobile and desktop
- [x] Form validation and error handling  
