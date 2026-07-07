import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Login({ isRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        await api.post('/auth/register', { username, password });
        navigate('/login');
      } else {
        const { data } = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="auth-layout">
      <div className="glass-panel auth-card">
        <h2 className="text-center">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-center text-muted mb-4">
          {isRegister ? 'Start securing your memories' : 'Unlock your digital time capsules'}
        </p>
        
        {error && <div className="text-error text-center mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '1.5rem' }}>
          {isRegister ? (
            <span className="text-muted">
              Already registered? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Login here</Link>
            </span>
          ) : (
            <span className="text-muted">
              Don't have an account? <Link to="/register" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Register here</Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
