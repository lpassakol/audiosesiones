import React from 'react';

const Sidebar = ({ view, setView, sessionId }) => (
  <nav style={{
    width: 220,
    background: '#fafafa',
    borderRight: '1px solid #eee',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    boxSizing: 'border-box',
  }}>
    <h2 style={{ margin: '0 0 24px 0', fontSize: 22 }}>Audio Sesiones</h2>
    <button style={buttonStyle(view === 'session')} onClick={() => setView('session')}>Sesiones</button>
    {sessionId && (
      <>
        <button style={buttonStyle(view === 'record')} onClick={() => setView('record')}>Grabar</button>
        <button style={buttonStyle(view === 'projects')} onClick={() => setView('projects')}>Proyectos</button>
      </>
    )}
  </nav>
);

function buttonStyle(active) {
  return {
    margin: '8px 0',
    padding: '12px 16px',
    border: 'none',
    borderRadius: 6,
    background: active ? '#e0e7ff' : '#fff',
    color: '#222',
    fontWeight: active ? 700 : 400,
    cursor: 'pointer',
    fontSize: 16,
    textAlign: 'left',
    transition: 'background 0.2s',
  };
}

export default Sidebar;
