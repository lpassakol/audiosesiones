import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import SessionSelector from './components/SessionSelector';
import AudioRecorder from './components/AudioRecorder';
import ProjectList from './components/ProjectList';

function App() {
  const [view, setView] = useState('session'); // session | record | projects
  const [sessionId, setSessionId] = useState(null);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar view={view} setView={setView} sessionId={sessionId} />
      <main style={{ flex: 1, padding: 24 }}>
        {!sessionId && <SessionSelector setSessionId={setSessionId} />}
        {sessionId && view === 'record' && <AudioRecorder sessionId={sessionId} />}
        {sessionId && view === 'projects' && <ProjectList sessionId={sessionId} />}
      </main>
    </div>
  );
}

export default App;
