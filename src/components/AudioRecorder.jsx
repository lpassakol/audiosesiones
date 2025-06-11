import React, { useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import { transcribeAndSummarize } from '../utils/openai';

const AudioRecorder = ({ sessionId }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setStatus('');
    setAudioUrl(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new window.MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));
      setStatus('Subiendo audio...');
      try {
        // 1. Subir audio a Supabase Storage
        const filename = `${sessionId}-${Date.now()}.webm`;
        const { data: storageData, error: storageError } = await supabase.storage.from('audios').upload(filename, blob, {
          cacheControl: '3600',
          upsert: false
        });
        if (storageError) throw new Error('Error subiendo audio: ' + storageError.message);
        const { data: publicUrlData } = supabase.storage.from('audios').getPublicUrl(filename);
        const audio_url = publicUrlData.publicUrl;
        setStatus('Transcribiendo...');
        // 2. Transcribir y resumir con OpenAI
        const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
        const { transcription, title, summary } = await transcribeAndSummarize(blob, openaiApiKey);
        setStatus('Guardando en la sesión...');
        // 3. Guardar en la tabla 'projects'
        const { error: dbError } = await supabase.from('projects').insert({
          session_id: sessionId,
          audio_url,
          transcription,
          title,
          summary
        });
        if (dbError) throw new Error('Error guardando en la base de datos: ' + dbError.message);
        setStatus('¡Listo!');
      } catch (err) {
        setStatus(err.message);
      }
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', textAlign: 'center' }}>
      <h3>Grabadora de audio</h3>
      <button onClick={recording ? stopRecording : startRecording} style={{
        padding: '20px 40px',
        fontSize: 18,
        border: 'none',
        borderRadius: 8,
        background: recording ? '#f87171' : '#34d399',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 700,
        marginBottom: 24,
      }}>
        {recording ? 'Detener' : 'Grabar'}
      </button>
      {audioUrl && <audio controls src={audioUrl} style={{ width: '100%', marginTop: 16 }} />}
      <div style={{ marginTop: 16, color: '#6366f1' }}>{status}</div>
    </div>
  );
};

export default AudioRecorder;
