import { logConversation } from '../../utils/logConversation.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  const { message, history = [] } = await request.json();

  // Load knowledge file from static assets
  let knowledge = '';
  try {
    const knowledgeRes = await env.ASSETS.fetch(new Request('/knowledge.txt'));
    if (knowledgeRes && knowledgeRes.ok) {
      knowledge = await knowledgeRes.text();
    }
  } catch (e) {
    console.error('Failed to load knowledge.txt from assets:', e);
  }

  // Build Gemini contents array
  const contents = [
    // history should be an array of objects in Gemini expected shape
    ...history,
    { role: 'user', parts: [{ text: message }] },
  ];

  // Call Gemini — plain fetch, no SDK
  const key = env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
    key || ''
  )}`;

  let reply = 'Sorry, I could not generate a response.';

  try {
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: knowledge }] },
        contents,
      }),
    });

    const geminiData = await geminiRes.json();
    reply =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || reply;
  } catch (e) {
    console.error('Gemini request failed:', e);
  }

  // Log to D1 — non-blocking, must not break the chat response
  try {
    await logConversation(env.DB, crypto.randomUUID(), message, reply);
  } catch (e) {
    console.error('D1 logging failed:', e);
  }

  return new Response(JSON.stringify({ reply }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
