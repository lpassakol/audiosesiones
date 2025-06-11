import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const ProjectList = ({ sessionId }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let subscription = null;
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      if (!error) setProjects(data);
    }
    fetchProjects();
    // Realtime subscription
    subscription = supabase
      .channel('projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `session_id=eq.${sessionId}` },
        payload => {
          fetchProjects();
        }
      )
      .subscribe();
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [sessionId]);

  return (
    <div>
      <h3 style={{ marginBottom: 24 }}>Proyectos de la sesión</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {projects.length === 0 && <span>No hay proyectos aún.</span>}
        {projects.map(proj => (
          <div key={proj.id} style={{
            background: '#f3f4f6',
            borderRadius: 10,
            padding: 20,
            minWidth: 260,
            maxWidth: 340,
            boxShadow: '0 2px 8px #0001',
          }}>
            <h4 style={{ margin: '0 0 12px 0' }}>{proj.title}</h4>
            <p style={{ margin: 0 }}>{proj.summary}</p>
            <audio controls src={proj.audio_url} style={{ width: '100%', marginTop: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
