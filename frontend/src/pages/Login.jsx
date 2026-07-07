import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

// Base URL for API requests
const API_URL = window.location.port === '5000' ? '' : 'http://localhost:5000';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert('Cannot be empty');

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error logging in');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>School Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="auth-btn">Join Class</button>
          <div className="auth-link">
            Need an account? <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
