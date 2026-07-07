import React, { useRef, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = import.meta.env.DEV ? 'http://localhost:5000' : '';
const socket = io(SOCKET_URL);

function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [cursors, setCursors] = useState({});
  const navigate = useNavigate();

  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Initial canvas background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    const onDraw = (data) => {
      drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size, false);
    };

    const onClear = () => {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const onCursor = (data) => {
      setCursors(prev => ({
        ...prev,
        [data.id]: { x: data.x, y: data.y, username: data.username }
      }));
    };

    const onUserDisconnected = (id) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[id];
        return newCursors;
      });
    };

    socket.on('draw', onDraw);
    socket.on('clear', onClear);
    socket.on('cursor', onCursor);
    socket.on('user_disconnected', onUserDisconnected);

    return () => {
      socket.off('draw', onDraw);
      socket.off('clear', onClear);
      socket.off('cursor', onCursor);
      socket.off('user_disconnected', onUserDisconnected);
    };
  }, [username, navigate]);

  const drawLine = (x0, y0, x1, y1, color, size, emit) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = 'round';
    context.stroke();
    context.closePath();

    if (!emit) return;

    socket.emit('draw', { x0, y0, x1, y1, color, size });
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let x, y;
    if (e.touches && e.touches.length > 0) {
      x = (e.touches[0].clientX - rect.left) * scaleX;
      y = (e.touches[0].clientY - rect.top) * scaleY;
    } else {
      x = (e.clientX - rect.left) * scaleX;
      y = (e.clientY - rect.top) * scaleY;
    }
    return { x, y };
  };

  const emitCursor = (x, y) => {
    socket.emit('cursor', { x, y, username });
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
    emitCursor(x, y);
  };

  const draw = (e) => {
    const { x, y } = getCoordinates(e);
    emitCursor(x, y);

    if (!isDrawing) return;
    
    drawLine(canvasRef.current.lastX, canvasRef.current.lastY, x, y, color, brushSize, true);
    
    canvasRef.current.lastX = x;
    canvasRef.current.lastY = y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
  };

  const logout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="school-background">
      <div className="desk-container">
        <div className="toolbar">
          <div className="tool-group">
            <span style={{marginRight: '15px', color: '#555'}}>Welcome, {username}!</span>
            <label htmlFor="colorPicker">Color:</label>
            <input 
              id="colorPicker"
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="color-picker"
            />
          </div>
          
          <div className="tool-group">
            <label htmlFor="brushSize">Size:</label>
            <input 
              id="brushSize"
              type="range" 
              min="1" 
              max="20" 
              value={brushSize} 
              onChange={(e) => setBrushSize(e.target.value)} 
            />
            <span className="size-indicator">{brushSize}px</span>
          </div>

          <div className="tool-group">
            <button className="btn clear-btn" onClick={clearBoard}>
              Clear Board
            </button>
            <button className="btn logout-btn" onClick={logout} style={{marginLeft: '10px'}}>
              Logout
            </button>
          </div>
        </div>

        <div className="canvas-wrapper">
          {/* Render other users' cursors */}
          {Object.entries(cursors).map(([id, cursor]) => (
            <div key={id} style={{
              position: 'absolute',
              left: cursor.x,
              top: cursor.y,
              pointerEvents: 'none',
              transform: 'translate(-5px, -5px)',
              zIndex: 10
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444',
                boxShadow: '0 0 4px rgba(0,0,0,0.5)'
              }}></div>
              <div style={{
                position: 'absolute', top: '12px', left: '12px',
                background: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 6px',
                borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap'
              }}>
                {cursor.username}
              </div>
            </div>
          ))}

          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="whiteboard"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
      </div>
    </div>
  );
}

export default Whiteboard;
