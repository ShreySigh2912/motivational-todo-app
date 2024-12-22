import React, { useState, useEffect } from 'react';
import { Plus, Calendar } from 'lucide-react';

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

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        ...newTask,
        completed: false,
        createdDate: new Date().toISOString()
      }
    ]);
    setNewTask({ 
      title: '', 
      description: '', 
      deadline: new Date().toISOString().slice(0, 16)
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description (optional)"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-500" />
            <input
              type="datetime-local"
              value={newTask.deadline}
              onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
              className="flex-1 p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add Task
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="p-4 rounded-lg shadow bg-white">
            <h3 className="text-xl">{task.title}</h3>
            <p className="text-gray-600 mt-2">{task.description}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <Calendar size={16} />
              <span>Due: {new Date(task.deadline).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoApp;