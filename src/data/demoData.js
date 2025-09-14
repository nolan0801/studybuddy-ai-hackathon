// Demo data for initial app state
export const demoTasks = [
  {
    id: 1,
    title: "Complete Calculus Assignment Chapter 7",
    description: "Solve differential equations problems 1-15 and submit online",
    subject: "Mathematics",
    dueDate: new Date().toISOString(),
    estimatedHours: 3,
    completed: false,
    status: "in-progress",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 2,
    title: "Prepare Computer Science Presentation",
    description: "Create slides for AI algorithms presentation next week",
    subject: "Computer Science", 
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    estimatedHours: 2,
    completed: false,
    status: "todo",
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 3,
    title: "Read English Literature Chapter 12",
    description: "Shakespeare analysis and write summary notes",
    subject: "Literature",
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    estimatedHours: 1.5,
    completed: true,
    status: "completed",
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 4,
    title: "Physics Lab Report",
    description: "Write lab report for electromagnetic induction experiment",
    subject: "Physics",
    dueDate: new Date(Date.now() + 259200000).toISOString(),
    estimatedHours: 4,
    completed: false,
    status: "on-hold",
    createdAt: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: 5,
    title: "Economics Essay Draft",
    description: "First draft of macroeconomics policy analysis essay",
    subject: "Economics",
    dueDate: new Date(Date.now() + 345600000).toISOString(),
    estimatedHours: 2.5,
    completed: true,
    status: "completed",
    completedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

export const demoStudySessions = [
  {
    id: 1,
    taskId: 1,
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() - 3600000).toISOString(),
    completed: true
  },
  {
    id: 2,
    taskId: 3,
    startTime: new Date(Date.now() - 10800000).toISOString(),
    endTime: new Date(Date.now() - 9000000).toISOString(),
    completed: true
  }
];

export const demoSettings = {
  aiEnabled: true,
  notifications: true,
  studyGoalHours: 8
};