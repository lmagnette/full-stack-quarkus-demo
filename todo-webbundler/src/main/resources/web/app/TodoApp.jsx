import React, { useState } from 'react';
import './TodoApp.css'; // Import the CSS file

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
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