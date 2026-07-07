import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#4f46e5'); // Default primary color
  const [lineWidth, setLineWidth] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    // Set exact dimensions to prevent stretching
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    
    // Set style dimensions
    canvas.style.width = `${parent.clientWidth}px`;
    canvas.style.height = `${parent.clientHeight}px`;

    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    contextRef.current = context;

    // Socket listener
    socket.on('draw', (data) => {
      if (!contextRef.current) return;
      const ctx = contextRef.current;
      const prevColor = ctx.strokeStyle;
      const prevWidth = ctx.lineWidth;

      ctx.strokeStyle = data.color;
      ctx.lineWidth = data.lineWidth;

      ctx.beginPath();
      ctx.moveTo(data.x0, data.y0);
      ctx.lineTo(data.x1, data.y1);
      ctx.stroke();
      ctx.closePath();

      ctx.strokeStyle = prevColor;
      ctx.lineWidth = prevWidth;
    });

    return () => {
      socket.off('draw');
    };
  }, []);

  // Update context when color or lineWidth changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Support both mouse and touch events
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const lastPosRef = useRef({ x: 0, y: 0 });

  const startDrawing = (e) => {
    if (e.type !== 'touchstart' && e.button !== 0) return; // Only left click or touch
    
    const { x, y } = getCoordinates(e);
    lastPosRef.current = { x, y };
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.type !== 'touchmove') e.preventDefault(); // Prevent scrolling while drawing

    const { x, y } = getCoordinates(e);
    const { x: lastX, y: lastY } = lastPosRef.current;
    
    const ctx = contextRef.current;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    // Emit to socket
    socket.emit('draw', {
      x0: lastX,
      y0: lastY,
      x1: x,
      y1: y,
      color,
      lineWidth
    });

    lastPosRef.current = { x, y };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
      <div className="glass-panel" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <h2 style={{ margin: 0, marginRight: 'auto' }}>Collaborative Whiteboard</h2>
        
        <div>
          <label style={{ marginRight: '0.5rem' }}>Color:</label>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div>
          <label style={{ marginRight: '0.5rem' }}>Thickness:</label>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(e.target.value)} 
          />
        </div>
        
        <button className="btn btn-secondary" onClick={() => {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
        }}>Clear Board (Local)</button>
      </div>

      <div className="glass-panel" style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseOut={finishDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={finishDrawing}
          onTouchMove={draw}
          style={{
            cursor: 'crosshair',
            background: 'rgba(15, 23, 42, 0.4)',
            touchAction: 'none'
          }}
        />
      </div>
    </div>
  );
}
