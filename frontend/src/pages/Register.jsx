import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Auth.css';

const API_URL = window.location.port === '5000' ? '' : 'http://localhost:5000';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      return alert('Cannot be empty');
    }
    if (password !== confirmPassword) {
      return alert('Passwords should be equal');
    }

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Signup Successful');
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Error registering');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>School Sign Up</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="auth-btn">Sign Up</button>
          <div className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
