import React, { useState, useEffect } from 'react';

const API_URL = '/api/todos';

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
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Todo App</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Add New Todo</h2>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
        </div>
        <div className="mb-2">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
        </div>
        <div className="mb-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
        </div>
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>
      
      <div>
        <h2 className="text-lg font-semibold mb-2">Your Todos</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500">No todos yet. Add one above!</p>
        ) : (
          <div className="space-y-4">
            {todos.map(todo => (
              <div 
                key={todo.id} 
                className={`p-4 border rounded ${todo.completed ? 'bg-green-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                      {todo.title}
                    </h3>
                    <p className={`mt-1 ${todo.completed ? 'text-gray-500' : ''}`}>
                      {todo.description}
                    </p>
                    {todo.dueDate && (
                      <p className="mt-2 text-sm text-gray-600">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleComplete(todo.id)}
                      className={`px-3 py-1 rounded ${
                        todo.completed 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                    >
                      {todo.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
