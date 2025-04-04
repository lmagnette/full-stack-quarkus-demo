import React, { useState, useEffect } from 'react';
import './TodoApp.css'; // Import the CSS file

// Define the base URL for your API endpoint
const API_URL = '/api/todo';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To show error messages

  // --- Fetch Todos on Component Mount ---
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTodos(data); // Set todos from the API response
      } catch (e) {
        console.error("Failed to fetch todos:", e);
        setError("Failed to load todos. Please try again later.");
        setTodos([]); // Clear todos on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []); // Empty dependency array means this runs once when the component mounts

  // --- Add Todo ---
  const addTodo = async () => {
    if (title.trim() === '') return;

    const newTodoData = {
      // The backend should assign the 'id'
      title,
      description,
      dueDate: dueDate || null, // Send null if date is empty
      completed: false
    };

    setIsLoading(true); // Indicate loading for the add operation
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodoData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedTodo = await response.json(); // Get the created todo (with ID) from API
      setTodos([...todos, addedTodo]); // Add the new todo to the local state
      // Clear the form
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (e) {
      console.error("Failed to add todo:", e);
      setError("Failed to add todo. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading indicator for add operation
    }
  };

  // --- Toggle Complete Status ---
  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    if (!todoToUpdate) return;

    const updatedStatus = !todoToUpdate.completed;

    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // Or 'PATCH' if your API supports partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        // Send only the field(s) that changed if using PATCH
        // body: JSON.stringify({ completed: updatedStatus }),
        // Or send the whole updated object if using PUT
        body: JSON.stringify({ ...todoToUpdate, completed: updatedStatus }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Option 1: If API returns the updated todo
      // const updatedTodo = await response.json();
      // setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));

      // Option 2: If API returns success (e.g., 200 OK/204 No Content) without the body
      setTodos(
          todos.map(todo =>
              todo.id === id ? { ...todo, completed: updatedStatus } : todo
          )
      );

    } catch (e) {
      console.error("Failed to toggle complete status:", e);
      setError("Failed to update todo status. Please try again.");
      // Note: No state reversion here, the UI reflects the last successful state or initial load
    }
    // No specific loading state for toggle, but you could add one if needed
  };

  // --- Delete Todo ---
  const deleteTodo = async (id) => {
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Handle specific errors like 404 Not Found if necessary
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If DELETE is successful, update the local state
      setTodos(todos.filter(todo => todo.id !== id));

    } catch (e) {
      console.error("Failed to delete todo:", e);
      setError("Failed to delete todo");
    }
  }

  return (
      <div className="todo-container">
        <h1 className="todo-title">Todo App</h1>

        <div className="add-todo-section">
          <h2 className="section-title">Add New Todo</h2>
          <div className="input-group">
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-input"
            />
          </div>
          <div className="input-group">
          <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-input"
          />
          </div>
          <div className="input-group">
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-input"
            />
          </div>
          <button
              onClick={addTodo}
              className="btn btn-primary"
          >
            Add Todo
          </button>
        </div>

        <div>
          <h2 className="section-title">Your Todos</h2>
          {todos.length === 0 ? (
              <p className="empty-message">No todos yet. Add one above!</p>
          ) : (
              <div className="todo-list">
                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className={`todo-item ${todo.completed ? 'completed' : ''}`}
                    >
                      <div className="todo-header">
                        <div className="todo-content">
                          <h3 className="todo-title-text">
                            {todo.title}
                          </h3>
                          <p className="todo-description">
                            {todo.description}
                          </p>
                          {todo.dueDate && (
                              <p className="todo-due-date">
                                Due: {new Date(todo.dueDate).toLocaleDateString()}
                              </p>
                          )}
                        </div>
                        <div className="todo-actions">
                          <button
                              onClick={() => toggleComplete(todo.id)}
                              className={`btn ${todo.completed ? 'btn-warning' : 'btn-success'}`}
                          >
                            {todo.completed ? 'Undo' : 'Complete'}
                          </button>
                          <button
                              onClick={() => deleteTodo(todo.id)}
                              className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>
      </div>
  );
};

export default TodoApp;