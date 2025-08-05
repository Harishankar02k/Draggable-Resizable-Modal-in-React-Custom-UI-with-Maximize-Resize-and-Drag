import React, { useState, useRef } from 'react';

export default function DraggableResizableModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 500, height: 400 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPosRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isMaximized) return;
    setPosition({
      x: e.clientX - startPosRef.current.x,
      y: e.clientY - startPosRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = 'auto';
  };

  const handleResize = (e) => {
    if (isMaximized) return;
    const newWidth = e.clientX - position.x;
    const newHeight = e.clientY - position.y;
    setSize({
      width: Math.min(window.innerWidth - position.x, newWidth),
      height: Math.min(window.innerHeight - position.y, newHeight),
    });
  };

  const handleMaximizeRestore = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setSize({ width: 500, height: 400 });
      setPosition({ x: 100, y: 100 });
    } else {
      setIsMaximized(true);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} style={styles.openButton}>
        Open Modal
      </button>
      {isOpen && (
        <div
          style={{
            ...styles.modal,
            top: position.y,
            left: position.x,
            width: size.width,
            height: size.height,
            cursor: isDragging ? 'grabbing' : 'default',
            userSelect: isDragging ? 'none' : 'auto',
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            style={styles.header}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
          >
            <span style={styles.title}>📝 Interactive Modal</span>
            <div style={styles.controls}>
              <button onClick={handleMaximizeRestore} style={styles.controlBtn}>
                {isMaximized ? '🗗' : '🗖'}
              </button>
              <button
                onClick={handleClose}
                style={{ ...styles.controlBtn, color: 'crimson' }}
              >
                ✖
              </button>
            </div>
          </div>
          <div style={styles.body}>
            <input
              type="text"
              placeholder="🔍 Search..."
              style={styles.searchInput}
            />
            <div style={styles.contentBox}>
              <p>Welcome to your interactive modal window! 👋</p>
              <ul>
                <li>✅ Drag to move</li>
                <li>🔄 Resize from right</li>
                <li>🗖 Maximize & Restore</li>
                <li>❌ Close anytime</li>
              </ul>
            </div>
          </div>
          {!isMaximized && (
            <div
              style={styles.resizeHandle}
              onMouseDown={(e) => {
                e.stopPropagation();
                document.body.style.userSelect = 'none'; // disable selection globally

                const onMove = (ev) => handleResize(ev);
                const onUp = () => {
                  document.removeEventListener('mousemove', onMove);
                  document.removeEventListener('mouseup', onUp);
                  document.body.style.userSelect = 'auto'; // re-enable
                };

                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  openButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    margin: '20px',
  },
  modal: {
    position: 'absolute',
    backgroundColor: '#fefefe',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
  },
  header: {
    padding: '12px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '18px',
    userSelect: 'none',
  },
  title: {
    fontWeight: 'bold',
  },
  controls: {
    display: 'flex',
    gap: '10px',
  },
  controlBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'white',
  },
  body: {
    padding: '20px',
    height: '100%',
    backgroundColor: '#f3f4f6',
    overflowY: 'auto',
  },
  searchInput: {
    width: '60%',
    padding: '8px 10px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginBottom: '20px',
    backgroundColor: '#e6f7ff',
  },
  contentBox: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #eee',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontSize: '15px',
    lineHeight: '1.6',
  },
  resizeHandle: {
    width: '10px',
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'ew-resize',
    zIndex: 10,
  },
};
