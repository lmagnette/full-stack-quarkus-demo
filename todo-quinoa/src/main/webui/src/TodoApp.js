import React, { useState } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([
    {
      id:1,
      title: "Introduce Quinoa",
      description: "Show how quinoa works and how easy it is to use",
      dueDate: Date.now(),
      completed: false
    },
    {
      id:2,
      title: "Introduce Web bundler",
      description: "Show how to get rid of npm and still use js based front-end",
      dueDate: Date.now(),
      completed: false
    }
  ]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const addTodo = () => {
    if (title.trim() === '') return;

    const newTodo = {
      id: Date.now(),
      title,
      description,
      dueDate,
      completed: false
    };

    setTodos([...todos, newTodo]);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      
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
