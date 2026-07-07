import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function ViewCapsule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const { data } = await api.get(`/capsules/${id}`);
        setCapsule(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load capsule');
      } finally {
        setLoading(false);
      }
    };
    fetchCapsule();
  }, [id]);

  useEffect(() => {
    if (!capsule || !capsule.isLocked) return;

    const timer = setInterval(() => {
      const unlockTime = new Date(capsule.unlockDate).getTime();
      const now = new Date().getTime();
      const distance = unlockTime - now;

      if (distance < 0) {
        clearInterval(timer);
        window.location.reload(); // Reload to fetch unlocked content
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [capsule]);

  if (loading) return <div className="text-center">Loading...</div>;

  if (error) return (
    <div className="glass-panel text-center">
      <h2 className="text-error">{error}</h2>
      <button className="btn btn-secondary mt-4" onClick={() => navigate('/')}>Go Back</button>
    </div>
  );

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--primary)', margin: 0 }}>{capsule.title}</h1>
      </div>
      
      {capsule.isLocked ? (
        <div className="text-center" style={{ padding: '4rem 0' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
          <h2>This capsule is locked</h2>
          <p className="text-muted mb-4">It will open in:</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '2px', color: 'var(--accent)' }}>
            {timeLeft}
          </div>
        </div>
      ) : (
        <div style={{ padding: '2rem 0' }}>
          <div className="badge unlocked" style={{ marginBottom: '2rem' }}>Unlocked</div>
          {capsule.mediaUrl && (
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <img 
                src={`http://localhost:5000${capsule.mediaUrl}`} 
                alt="Capsule Memory" 
                style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} 
              />
            </div>
          )}
          <div 
            style={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: '1.6', 
              fontSize: '1.1rem',
              background: 'rgba(15, 23, 42, 0.4)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            {capsule.content}
          </div>
        </div>
      )}
    </div>
  );
}
