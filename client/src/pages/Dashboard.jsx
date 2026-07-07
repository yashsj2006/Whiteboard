import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/register');
      return;
    }

    const fetchCapsules = async () => {
      try {
        const { data } = await api.get('/capsules');
        setCapsules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsules();
  }, [navigate]);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Your Time Capsules</h2>
      
      {capsules.length === 0 ? (
        <div className="glass-panel text-center">
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>You haven't created any time capsules yet.</p>
          <Link to="/create" className="btn btn-primary">Create Your First Capsule</Link>
        </div>
      ) : (
        <div className="capsule-grid">
          {capsules.map(capsule => {
            const isLocked = new Date(capsule.unlockDate) > new Date();
            
            return (
              <Link to={`/capsule/${capsule.id}`} key={capsule.id} className="glass-panel capsule-card">
                <span className={`badge ${isLocked ? 'locked' : 'unlocked'}`}>
                  {isLocked ? 'Locked' : 'Unlocked'}
                </span>
                <h3>{capsule.title}</h3>
                <p className="text-muted" style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  {isLocked ? 'Unlocks' : 'Unlocked'} on: {new Date(capsule.unlockDate).toLocaleDateString()}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
