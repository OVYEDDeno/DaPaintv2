import React, { useEffect, useRef } from 'react';

const PlayCursor = ({ visible }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!visible) return;
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', moveCursor);
    return () => document.removeEventListener('mousemove', moveCursor);
  }, [visible]);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Anton',
        fontSize: '2rem',
        color: '#fff',
        background: '#ff0000',
        padding: '0.3em 1em',
        borderRadius: '2em',
        boxShadow: '0 2px 8px #000000',
        userSelect: 'none',
        fontWeight: 'bold',
        letterSpacing: '0.1em',
      }}
    >
      PLAY
    </div>
  );
};

export default PlayCursor; 