import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateCapsule() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mediaUrl = null;
      if (mediaFile) {
        const formData = new FormData();
        formData.append('media', mediaFile);
        const { data } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        mediaUrl = data.url;
      }

      await api.post('/capsules', {
        title,
        content,
        unlockDate,
        isPublic,
        mediaUrl
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.details || err.response?.data?.error || 'Failed to create capsule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="text-center" style={{ marginBottom: '2rem' }}>Create a New Time Capsule</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input 
            type="text" 
            className="form-input" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="A message to my future self"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Message / Content</label>
          <textarea 
            className="form-input" 
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            placeholder="Write your thoughts here..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Attach a Photo (Optional)</label>
          <input 
            type="file" 
            accept="image/*"
            className="form-input" 
            onChange={e => setMediaFile(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Unlock Date & Time</label>
          <input 
            type="datetime-local" 
            className="form-input" 
            value={unlockDate}
            onChange={e => setUnlockDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input 
            type="checkbox" 
            id="isPublic"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
          />
          <label htmlFor="isPublic" style={{ color: '#cbd5e1' }}>Make this capsule public (anyone can read after unlock)</label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'Burying Capsule...' : 'Bury Capsule'}
        </button>
      </form>
    </div>
  );
}
