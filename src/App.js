import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    due_date: ''
  });

  // ✅ Fetch tasks from the correct endpoint
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/all/') // Changed from /api/tasks/
      .then(response => setTasks(response.data))
      .catch(error => console.log("Error fetching data:", error));
  }, []);

  // ✅ Handle input change
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // ✅ Add a new task
  const addTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.due_date.trim()) {
      alert("All fields are required!");
      return;
    }

    axios.post('http://127.0.0.1:8000/create/', newTask) // Changed from /api/tasks/
      .then(response => {
        setTasks([...tasks, response.data]); // Add new task to the list
        setNewTask({ title: '', description: '', status: 'Pending', priority: 'Medium', due_date: '' }); // Reset form
      })
      .catch(error => console.log("Error adding task:", error));
  };

  // ✅ Handle search query
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Delete a task
  const deleteTask = (id) => {
    axios.delete(`http://127.0.0.1:8000/delete/${id}/`) // Changed from /api/tasks/id/
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(error => console.log("Error deleting task:", error));
  };

  // ✅ Update a task (Mark as Completed)
  const updateTask = (id, updatedTask) => {
    axios.put(`http://127.0.0.1:8000/update/${id}/`, updatedTask) // Changed from /api/tasks/id/
      .then(response => {
        setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      })
      .catch(error => console.log("Error updating task:", error));
  };

  // ✅ Filter tasks dynamically based on search input
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Task Manager</h1>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* ✅ Form to Add Task */}
      <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleChange} />
      <input type="text" name="description" placeholder="Description" value={newTask.description} onChange={handleChange} />
      <input type="date" name="due_date" value={newTask.due_date} onChange={handleChange} />
      <button onClick={addTask}>Add Task</button>

      {/* ✅ Display Filtered Tasks */}
      <ul>
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <li key={task.id}>
              {task.title} - {task.status}
              <button onClick={() => updateTask(task.id, { ...task, status: "Completed" })}>Complete</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))
        ) : (
          <p>No tasks found</p>
        )}
      </ul>
    </div>
  );
}

export default App;
