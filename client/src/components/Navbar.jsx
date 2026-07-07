import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="glass-nav">
      <Link to="/" className="nav-brand">CollabBoard</Link>
      <div className="nav-links">
        {token ? (
          <>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="text-muted">Welcome, {username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
