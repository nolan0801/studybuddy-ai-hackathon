import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Plus, Edit } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import TaskModal from '../components/TaskModal';
import StatusBadge from '../components/StatusBadge';

function CalendarView() {
  const { tasks, TASK_STATUS } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
            Calendar View
          </h1>
          <button 
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Calendar */}
        <div className="calendar-container">
          <div className="calendar-header">
            <button onClick={handlePrevMonth} className="calendar-nav-btn">
              <ChevronLeft size={20} />
            </button>
            <h2 className="calendar-month-title">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button onClick={handleNextMonth} className="calendar-nav-btn">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map(day => {
              const dayTasks = getTasksForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
                >
                  <div className="calendar-day-number">
                    {format(day, 'd')}
                  </div>
                  
                  {dayTasks.length > 0 && (
                    <div className="calendar-day-tasks">
                      {dayTasks.slice(0, 3).map((task, index) => (
                        <div
                          key={index}
                          className="calendar-task-dot"
                          style={{
                            background: task.status === TASK_STATUS.COMPLETED ? '#28a745' : 
                                       task.status === TASK_STATUS.IN_PROGRESS ? '#ffc107' :
                                       task.status === TASK_STATUS.ON_HOLD ? '#6c757d' : '#667eea'
                          }}
                        />
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="calendar-task-overflow">
                          +{dayTasks.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="selected-date-panel">
          <h3 className="selected-date-title">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {selectedDateTasks.length === 0 ? (
            <div className="no-tasks-message">
              <p>No tasks scheduled for this date</p>
              <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
                Click "Add Task" to schedule something new
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {selectedDateTasks.map(task => (
                <div
                  key={task.id}
                  className="task-card"
                  style={{
                    background: task.status === TASK_STATUS.COMPLETED ? 'rgba(40, 167, 69, 0.1)' : 
                               task.status === TASK_STATUS.IN_PROGRESS ? 'rgba(255, 193, 7, 0.1)' :
                               task.status === TASK_STATUS.ON_HOLD ? 'rgba(108, 117, 125, 0.1)' : 
                               'rgba(102, 126, 234, 0.1)',
                    borderLeftColor: task.status === TASK_STATUS.COMPLETED ? '#28a745' : 
                                    task.status === TASK_STATUS.IN_PROGRESS ? '#ffc107' :
                                    task.status === TASK_STATUS.ON_HOLD ? '#6c757d' : '#667eea'
                  }}
                  onClick={() => handleEditTask(task)}
                >
                  <div className="task-card-header">
                    <h4 className="task-card-title" style={{ 
                      textDecoration: task.status === TASK_STATUS.COMPLETED ? 'line-through' : 'none',
                      color: task.status === TASK_STATUS.COMPLETED ? '#666' : '#333'
                    }}>
                      {task.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <StatusBadge task={task} showDropdown={false} />
                      <Edit size={16} className="edit-indicator" />
                    </div>
                  </div>
                  
                  <div className="task-card-meta">
                    <span>🕐 {format(new Date(task.dueDate), 'HH:mm')}</span>
                    <span>⏱️ {task.estimatedHours.toFixed(2)}h</span>
                  </div>
                  
                  {task.description && (
                    <p className="task-card-description">
                      {task.description}
                    </p>
                  )}
                  
                  {task.subject && (
                    <span className="task-card-subject">
                      {task.subject}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showModal && (
        <TaskModal 
          task={editingTask}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default CalendarView;