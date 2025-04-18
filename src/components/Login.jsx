import React, { useState } from 'react';

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  return (
    <div className="login-container">
      <h1>Welcome</h1>
      <p>What should people call you?</p>

      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(username);
        }}
        className="login-form"
      >
        <input
          className="input-field"
          type="text"
          value={username}
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          required
        />
        <button type="submit" className="submit-button">
          Enter
        </button>
      </form>
    </div>
  );
};

export default Login;
