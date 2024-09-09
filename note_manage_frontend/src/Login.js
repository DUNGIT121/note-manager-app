import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ phone, password });
    // Handle login logic here
  };

  return (
    <div className='content-login'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Phone:</label>
          <input 
            type="text" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
        <div>if you do not have an account
          <Link to="/register"> Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
