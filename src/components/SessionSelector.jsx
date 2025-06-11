import React, { useState } from 'react';

const SessionSelector = ({ setSessionId }) => {
  const [session, setSession] = useState('');

  // Aquí luego conectaremos con Supabase para obtener/crear sesiones

  const handleJoin = () => {
    if (session.trim()) {
      setSessionId(session.trim());
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
      <h3>Selecciona o crea una sesión</h3>
      <input
        type="text"
        placeholder="Nombre de la sesión"
        value={session}
        onChange={e => setSession(e.target.value)}
        style={{
          padding: 12,
          fontSize: 16,
          border: '1px solid #ddd',
          borderRadius: 6,
          width: '100%',
          marginBottom: 16,
        }}
      />
      <button onClick={handleJoin} style={{
        padding: '12px 32px',
        fontSize: 16,
        border: 'none',
        borderRadius: 6,
        background: '#6366f1',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
      }}>
        Entrar
      </button>
    </div>
  );
};

export default SessionSelector;
