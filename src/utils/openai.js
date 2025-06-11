// Utilidad para transcribir y resumir usando la API de OpenAI
export async function transcribeAndSummarize(audioBlob, openaiApiKey) {
  // 1. Transcribir audio usando Whisper API
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  
  const transcriptRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: formData
  });
  if (!transcriptRes.ok) throw new Error('Error en la transcripción');
  const transcriptData = await transcriptRes.json();
  const transcription = transcriptData.text;

  // 2. Generar título y resumen usando GPT
  const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Eres un asistente que ayuda a resumir y titular iniciativas de proyectos.' },
        { role: 'user', content: `Transcripción: ${transcription}\n\nGenera un título breve y un resumen de máximo 3 líneas para esta propuesta. Devuelve el resultado en formato JSON: {"title": "...", "summary": "..."}` }
      ],
      max_tokens: 200
    })
  });
  if (!gptRes.ok) throw new Error('Error generando resumen');
  const gptData = await gptRes.json();
  let title = '', summary = '';
  try {
    const json = JSON.parse(gptData.choices[0].message.content);
    title = json.title;
    summary = json.summary;
  } catch {
    // fallback: texto plano
    title = 'Sin título';
    summary = gptData.choices[0].message.content;
  }

  return { transcription, title, summary };
}
