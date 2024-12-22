import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Check, AlertCircle } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    deadline: new Date().toISOString().slice(0, 16)
  });
  
  const [showQuote, setShowQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [notifications, setNotifications] = useState([]);

  const quotes = [
    "Great job! Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Well done! The only way to do great work is to love what you do.",
    "Excellent! Believe you can and you're halfway there.",
    "Amazing work! Your positive action combined with positive thinking results in success."
  ];

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkDeadlines, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    checkDeadlines();
  }, [tasks]);

  const checkDeadlines = () => {
    const now = new Date();
    const newNotifications = [];

    tasks.forEach(task => {
      if (!task.completed) {
        const deadline = new Date(task.deadline);
        const timeDiff = deadline.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff <= 24 && hoursDiff > 0) {
          const notification = {
            id: task.id,
            message: `Task "${task.title}" is due in ${Math.floor(hoursDiff)} hours!`,
            type: 'warning'
          };
          
          if (!notifications.find(n => n.id === task.id)) {
            newNotifications.push(notification);
            if (Notification.permission === 'granted') {
              new Notification('Task Due Soon', {
                body: notification.message,
                icon: '/favicon.ico'
              });
            }
          }
        } else if (hoursDiff <= 0) {
          const notification = {
            id: task.id,
            message: `Task "${task.title}" is overdue!`,
            type: 'danger'
          };
          
          if (!notifications.find(n => n.id === task.id)) {
            newNotifications.push(notification);
          }
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications(prev => [...prev, ...newNotifications]);
    }
  };

  const dismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // ... rest of the component code remains the same ...
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>
      
      {notifications.length > 0 && (
        <div className="mb-8 space-y-2">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg flex items-center justify-between ${
                notification.type === 'danger' ? 'bg-red-100' : 'bg-yellow-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className={notification.type === 'danger' ? 'text-red-500' : 'text-yellow-500'} />
                <span>{notification.message}</span>
              </div>
              <button 
                onClick={() => dismissNotification(notification.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
};

export default TodoApp;