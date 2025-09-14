import React from 'react';
import { useTask } from '../context/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, Target, Award, Brain } from 'lucide-react';
import { format, startOfWeek, eachDayOfInterval, addDays, isThisWeek, subWeeks } from 'date-fns';

function AnalyticsView() {
  const { tasks, studySessions, TASK_STATUS, AIHelpers } = useTask();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
  const inProgressTasks = tasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length;
  const onHoldTasks = tasks.filter(task => task.status === TASK_STATUS.ON_HOLD).length;
  const todoTasks = tasks.filter(task => task.status === TASK_STATUS.TODO).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalEstimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
  const completedHours = tasks
    .filter(task => task.status === TASK_STATUS.COMPLETED)
    .reduce((sum, task) => sum + (task.estimatedHours || 0), 0);

  // Subject distribution
  const subjectStats = tasks.reduce((acc, task) => {
    if (task.subject) {
      acc[task.subject] = (acc[task.subject] || 0) + 1;
    }
    return acc;
  }, {});

  const subjectData = Object.entries(subjectStats).map(([subject, count]) => ({
    name: subject,
    value: count
  }));

  // Task status distribution
  const statusData = [
    { name: 'Completed', value: completedTasks, color: '#28a745' },
    { name: 'In Progress', value: inProgressTasks, color: '#ffc107' },
    { name: 'To Do', value: todoTasks, color: '#667eea' },
    { name: 'On Hold', value: onHoldTasks, color: '#6c757d' }
  ].filter(item => item.value > 0);

  // Weekly productivity
  const last4Weeks = [];
  for (let i = 3; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    const weekEnd = addDays(weekStart, 6);
    const weekTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= weekStart && taskDate <= weekEnd;
    });
    const completedThisWeek = weekTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
    
    last4Weeks.push({
      week: format(weekStart, 'MMM d'),
      completed: completedThisWeek,
      total: weekTasks.length,
      percentage: weekTasks.length > 0 ? Math.round((completedThisWeek / weekTasks.length) * 100) : 0
    });
  }

  // Daily completion pattern
  const dailyPattern = [];
  for (let i = 0; i < 7; i++) {
    const day = format(addDays(startOfWeek(new Date()), i), 'EEE');
    const dayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.getDay() === i;
    });
    const completedOnDay = dayTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length;
    
    dailyPattern.push({
      day,
      completed: completedOnDay,
      total: dayTasks.length
    });
  }

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b'];

  const productivityScore = AIHelpers.calculateProductivityScore(studySessions);

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          Analytics Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '16px' }}>
          Track your study progress and productivity patterns
        </p>
        
        {/* Data Summary */}
        <div style={{ 
          background: 'rgba(102, 126, 234, 0.1)', 
          borderRadius: '8px', 
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>📊 Data Analysis Period:</span>
            <span style={{ color: '#667eea' }}>All Time</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>📈 Total Tasks Analyzed:</span>
            <span style={{ color: '#667eea', fontWeight: '600' }}>{totalTasks}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '600', color: '#333' }}>🎯 Data Sources:</span>
            <span style={{ color: '#667eea' }}>Task Completion, Time Tracking, Subject Performance</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white'
            }}>
              <Target size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {completionRate}%
              </h3>
              <p style={{ color: '#666' }}>Overall Completion Rate</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white'
            }}>
              <Clock size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {completedHours}h
              </h3>
              <p style={{ color: '#666' }}>Study Hours Completed</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                of {totalEstimatedHours}h total planned
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white'
            }}>
              <TrendingUp size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {inProgressTasks}
              </h3>
              <p style={{ color: '#666' }}>Tasks In Progress</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                {todoTasks} pending, {onHoldTasks} on hold
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '12px',
              padding: '16px',
              color: 'white'
            }}>
              <Brain size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                {productivityScore}
              </h3>
              <p style={{ color: '#666' }}>AI Productivity Score</p>
              <p style={{ color: '#999', fontSize: '14px' }}>
                Based on completion patterns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid analytics-grid-3">
        {/* Weekly Progress */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              Weekly Progress Trend
            </h3>
            <div className="chart-meta">
              <div>📊 Data: Last 4 weeks</div>
              <div>📈 Metric: Task completion rate</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={last4Weeks} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis 
                dataKey="week" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: 'rgba(102, 126, 234, 0.2)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: 'rgba(102, 126, 234, 0.2)' }}
              />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'completed' ? `${value} completed` : `${value} total`,
                  name === 'completed' ? 'Completed Tasks' : 'Total Tasks'
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="completed" fill="url(#colorCompleted)" name="completed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" fill="rgba(233, 236, 239, 0.8)" name="total" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Task Status Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              Task Status Breakdown
            </h3>
            <div className="chart-meta">
              <div>📊 Data: All {totalTasks} tasks</div>
              <div>📈 Metric: Current status distribution</div>
            </div>
          </div>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} tasks (${((value / totalTasks) * 100).toFixed(0)}%)`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '12px', 
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '8px'
              }}>
                {statusData.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: entry.color
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>
                      {entry.name}: {entry.value} ({((entry.value / totalTasks) * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px', color: '#666' }}>
              <p>No task data available</p>
            </div>
          )}
        </div>

        {/* Subject Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              Subject Workload Analysis
            </h3>
            <div className="chart-meta">
              <div>📊 Data: {Object.keys(subjectStats).length} subjects</div>
              <div>📈 Metric: Number of tasks per subject</div>
            </div>
          </div>
          {subjectData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth={2}
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} tasks (${((value / subjectData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)`, name]}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Custom Legend */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                gap: '12px', 
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '8px'
              }}>
                {subjectData.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: COLORS[index % COLORS.length]
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#333' }}>
                      {entry.name}: {entry.value} ({((entry.value / subjectData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)}%)
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px', color: '#666' }}>
              <p>No subject data available</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Add subjects to your tasks to see distribution
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid analytics-grid-2" style={{ marginTop: '32px' }}>
        {/* Daily Completion Pattern */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              Weekly Completion Pattern
            </h3>
            <div className="chart-meta">
              <div>📊 Data: Tasks grouped by day of week</div>
              <div>📈 Metric: Completed tasks per weekday</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dailyPattern} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: 'rgba(102, 126, 234, 0.2)' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#666' }}
                axisLine={{ stroke: 'rgba(102, 126, 234, 0.2)' }}
              />
              <Tooltip 
                formatter={(value, name) => [`${value} tasks completed`, 'Completed Tasks']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                stroke="url(#colorGradient)"
                strokeWidth={4}
                name="Completed Tasks"
                dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2, fill: '#fff' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#667eea" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#764ba2" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">
              AI-Powered Insights
            </h3>
            <div className="chart-meta">
              <div>🤖 Analysis: Based on completion patterns</div>
              <div>📊 Data: {totalTasks} tasks, {completedTasks} completed</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(102, 126, 234, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }} />
              <h4 style={{ fontWeight: '700', marginBottom: '8px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                📈 Productivity Analysis
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#667eea', background: 'rgba(102, 126, 234, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  {completedTasks}/{totalTasks} completion rate
                </span>
              </h4>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {completionRate >= 80 ? 
                  `Excellent! Your ${completionRate}% completion rate shows strong time management skills.` :
                  completionRate >= 60 ? 
                  `Good progress! Your ${completionRate}% completion rate is above average. Focus on consistency.` :
                  `Your ${completionRate}% completion rate suggests breaking tasks into smaller chunks might help.`
                }
              </p>
            </div>

            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(67, 233, 123, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              }} />
              <h4 style={{ fontWeight: '700', marginBottom: '8px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                ⏰ Optimal Study Time
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#43e97b', background: 'rgba(67, 233, 123, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  Based on {completedTasks} completed tasks
                </span>
              </h4>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                Based on your completion patterns, {AIHelpers.suggestStudyTime(tasks, studySessions)} appears to be your most productive time. 
                {completedTasks > 0 ? ` This recommendation is based on ${completedTasks} completed tasks.` : ' Create more tasks to improve this analysis.'}
              </p>
            </div>

            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.05) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(240, 147, 251, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              }} />
              <h4 style={{ fontWeight: '700', marginBottom: '8px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                🎯 Subject Balance Recommendation
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#f093fb', background: 'rgba(240, 147, 251, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  {Object.keys(subjectStats).length} subjects, {totalTasks} tasks
                </span>
              </h4>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {Object.keys(subjectStats).length > 0 ? 
                  `Your most active subject is ${Object.entries(subjectStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'} with ${Object.entries(subjectStats).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} tasks. Consider balancing study time across all ${Object.keys(subjectStats).length} subjects.` :
                  'Add subjects to your tasks to get personalized study balance recommendations.'
                }
              </p>
            </div>

            <div style={{ 
              padding: '20px', 
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 193, 7, 0.05) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(255, 193, 7, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '4px',
                height: '100%',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8a00 100%)'
              }} />
              <h4 style={{ fontWeight: '700', marginBottom: '8px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                📊 Workload Analysis
                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ffc107', background: 'rgba(255, 193, 7, 0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                  {inProgressTasks} active, {onHoldTasks} on hold, {todoTasks} pending
                </span>
              </h4>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                {inProgressTasks > 5 ? 
                  `You have ${inProgressTasks} tasks in progress. Consider focusing on completing current tasks before starting new ones.` :
                  inProgressTasks === 0 ? 
                  'No tasks currently in progress. Start working on your pending tasks!' :
                  `Good balance with ${inProgressTasks} active tasks. This is manageable for productive workflow.`
                }
                {onHoldTasks > 0 && ` You have ${onHoldTasks} tasks on hold - review if these can be resumed or removed.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsView;