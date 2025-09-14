import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Plus, Clock, AlertCircle, CheckCircle2, Edit, Trash2, Brain } from 'lucide-react';
import TaskModal from '../components/TaskModal';
import StatusBadge from '../components/StatusBadge';
import PomodoroTimer from '../components/PomodoroTimer';
import { format, isToday, isPast } from 'date-fns';

function TodayView() {
  const { tasks, dispatch, ACTIONS, TASK_STATUS, AIHelpers } = useTask();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filter today's tasks and sort by AI priority
  const todayTasks = tasks
    .filter(task => {
      const taskDate = new Date(task.dueDate);
      return isToday(taskDate) || (isPast(taskDate) && !task.completed);
    })
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = AIHelpers.generateTaskPriority(a);
      const bPriority = AIHelpers.generateTaskPriority(b);
      return priorityOrder[bPriority] - priorityOrder[aPriority];
    });

  const completedToday = tasks.filter(task => 
    task.completed && task.completedAt && isToday(new Date(task.completedAt))
  ).length;

  const totalToday = todayTasks.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const handleToggleTask = (taskId) => {
    dispatch({ type: ACTIONS.TOGGLE_TASK, payload: taskId });
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    dispatch({ type: ACTIONS.DELETE_TASK, payload: taskId });
  };

  const aiSuggestion = AIHelpers.suggestStudyTime(tasks, []);

  return (
    <div>
      <div className="card" style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>
          Today's Focus
        </h1>
        <p style={{ color: '#666', fontSize: '18px' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        {/* Today's Tasks */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              Today's Tasks ({todayTasks.length})
            </h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 32px', color: '#666' }}>
              <Clock size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>No tasks scheduled for today</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Click "Add Task" to create your first task
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {todayTasks.map(task => {
                const priority = AIHelpers.generateTaskPriority(task);
                const isOverdue = isPast(new Date(task.dueDate)) && task.status !== TASK_STATUS.COMPLETED;
                
                return (
                  <div 
                    key={task.id} 
                    className={`task-item priority-${priority} ${task.status} ${isOverdue ? 'overdue' : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <button
                        onClick={() => handleToggleTask(task.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          marginTop: '2px'
                        }}
                      >
                        <CheckCircle2 
                          size={20} 
                          color={task.status === TASK_STATUS.COMPLETED ? '#28a745' : '#ccc'}
                          fill={task.status === TASK_STATUS.COMPLETED ? '#28a745' : 'none'}
                        />
                      </button>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 style={{ 
                            textDecoration: task.status === TASK_STATUS.COMPLETED ? 'line-through' : 'none',
                            color: task.status === TASK_STATUS.COMPLETED ? '#999' : '#333',
                            margin: 0,
                            flex: 1
                          }}>
                            {task.title}
                          </h3>
                          <StatusBadge task={task} />
                        </div>
                        
                        {task.description && (
                          <p style={{ 
                            color: '#666', 
                            marginBottom: '12px',
                            fontSize: '14px',
                            lineHeight: '1.4'
                          }}>
                            {task.description}
                          </p>
                        )}
                        
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '14px', color: '#666', alignItems: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={14} />
                            {format(new Date(task.dueDate), 'HH:mm')}
                          </span>
                          
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ⏱️ {task.estimatedHours.toFixed(2)}h
                          </span>
                          
                          {task.subject && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              📚 {task.subject}
                            </span>
                          )}
                          
                          <span style={{ 
                            color: priority === 'high' ? '#dc3545' : priority === 'medium' ? '#ffc107' : '#28a745',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <AlertCircle size={14} />
                            {priority.toUpperCase()} PRIORITY
                          </span>
                          
                          {isOverdue && (
                            <span style={{ color: '#dc3545', fontWeight: '600' }}>
                              OVERDUE
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="btn btn-secondary"
                          style={{ padding: '8px' }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="btn btn-secondary"
                          style={{ padding: '8px', color: '#dc3545' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pomodoro Timer */}
        <PomodoroTimer />
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal 
          key={editingTask?.id || 'new-task'}
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

export default TodayView;