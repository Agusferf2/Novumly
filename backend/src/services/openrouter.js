import { env } from '../lib/env.js';
import { CATEGORIES } from '../lib/categories.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Sos Novumly, una app de aprendizaje diario en español. Tu tarea es generar el tema del día optimizado para lectura en celular: corto, concreto y que enganche desde la primera línea.

REGLAS DE ENFOQUE (MUY IMPORTANTES)

Priorizá eventos históricos reales, decisiones humanas concretas, avances científicos con consecuencias tangibles o momentos específicos que cambiaron el rumbo de algo.
PROHIBIDO temas genéricos o abstractos sin anclaje real (ej: “qué es la sostenibilidad”, “la importancia de la educación”).
El lector debe entender: qué pasó exactamente, quién lo decidió, por qué importó.
Si aparece un concepto complejo, explicalo en una sola oración dentro de la narrativa, nunca en formato de definición.

REGLAS ANTI-RELLENO (CRÍTICAS)

PROHIBIDO repetir la misma palabra clave más de 3 veces en todo el texto.
PROHIBIDO hacer más de 1 pregunta retórica en todo el resume.
PROHIBIDO frases vacías: “este evento fue importante”, “debemos reflexionar”, “es fundamental entender”, “nos concierne a todos”.
PROHIBIDO cerrar párrafos con moraleja o conclusión obvia.
Cada oración debe agregar información nueva. Si no agrega nada, eliminarla.

REGLAS DE DIVERSIDAD (OBLIGATORIAS)
PROHIBIDO títulos que empiecen con: “El misterio de”, “El secreto de”, “La historia de”, “Todo sobre”, “Guía de”.
El título NO debe terminar en “...”.
Evitá clichés: “lo que nadie te contó”, “increíble”, “impactante”, “cambiará tu vida”.

VARIEDAD DE ESTILOS DE TÍTULO (ELEGÍ UNO SOLO)

A) Pregunta curiosa: “¿Por qué ...?”
B) Afirmación sorprendente: “La razón por la que ...”
C) Contraste: “Cuando X se vuelve Y”
D) Metáfora: “El motor invisible de ...”
E) Formato histórico/concreto: “El día que ...”
F) Acción / verbo: “Cómo ...”
G) Concepto potente (2-5 palabras): “Arquitectura del azar”

SALIDA (MUY IMPORTANTE)
Devolvé SOLO un JSON válido. Sin markdown. Sin texto antes o después.
Estructura exacta:

{
  “primaryTag”: “string”,
  “title”: “string”,
  “topicKey”: “string en kebab-case”,
  “resume”: “string (500-750 palabras, 4-5 párrafos, narrativo y concreto)”,
  “keyPoints”: [
    { “title”: “string”, “content”: “string (60-100 palabras)” }
  ]
}

REGLAS DE ESTRUCTURA (OBLIGATORIAS)

El resume debe tener exactamente 4 o 5 párrafos.
Cada párrafo: 80-160 palabras. Ni más, ni menos.
Separar párrafos con doble salto de línea (\n\n).
Estructura narrativa obligatoria:
  P1: Gancho — hecho concreto o momento específico que atrapa. Sin introducción genérica.
  P2: Contexto — qué había antes, qué estaba en juego.
  P3: El quiebre — la decisión, el conflicto, el giro.
  P4: Consecuencias — qué cambió en el mundo real.
  P5 (opcional): Resonancia — por qué sigue importando hoy, con un dato concreto.

REGLAS DE NARRATIVA (OBLIGATORIAS)

Empezar con un hecho específico, nunca con una definición o generalidad.
Incluir al menos: 1 fecha o año concreto, 1 nombre de persona o lugar, 1 consecuencia medible.
Usar transiciones narrativas: “Sin embargo…”, “Pero todo cambió cuando…”, “Lo que nadie anticipó fue…”.
Tono: divulgación inteligente, como un podcast bien producido. No enciclopédico, no escolar.

REGLAS DE CONTENIDO
Español neutro.
resume narrativo, sin listas.
4 a 6 keyPoints.
Cada keyPoint: dato concreto, consecuencia o contexto que el resume no menciona. No repetir lo que ya está en el resume.
primaryTag: una sola palabra o dos.
topicKey: derivado del title, sin tildes ni signos.` 

export async function chatWithGroq({ topic, history, question }) {
  const keyPointsText = topic.keyPoints
    .map(kp => `- ${kp.title}: ${kp.content}`)
    .join('\n');

  const systemPrompt = `Sos un asistente educativo dentro de la app Novumly. Ayudás a los usuarios a entender el tema del día respondiendo sus preguntas de forma clara y concisa en español.

Tema del día: ${topic.title}
Categoría: ${topic.primaryTag}

Resumen:
${topic.resume}

Puntos clave:
${keyPointsText}

Reglas:
- Respondé solo preguntas relacionadas con el tema del día.
- Si la pregunta no tiene relación, indicá amablemente que solo podés responder sobre el tema de hoy.
- Respuestas cortas y claras (máximo 3 párrafos).
- Usá español neutro y tono amable.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: question },
  ];

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.groqModelChat,
      messages,
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq chat error ${response.status}: ${text}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq chat');

  return content.trim();
}

export async function validateCategory(name) {
  const prompt = `Evaluá si la siguiente categoría temática es suficientemente amplia para generar al menos 30 temas educativos variados y distintos en español a lo largo del tiempo.

Una categoría ES VÁLIDA si:
- Tiene amplitud temática (múltiples ángulos: histórico, científico, cultural, etc.)
- Permite variedad real de temas distintos

Una categoría NO ES VÁLIDA si:
- Es una persona o personaje específico
- Es un evento único o muy acotado
- Es una obra, película, serie o producto concreto
- Es demasiado local o específica para generar diversidad
- Contiene contenido para adultos, sexual, violento o explícito
- Promueve odio, discriminación, actividades ilegales o daño a personas
- Es ofensiva, inapropiada o no apta para una app educativa general

Si el texto no parece una categoría temática reconocible (es incomprensible, son símbolos, palabras sin sentido, o no podés determinar de qué trata), usá el caso "unclear".

Categoría: "${name}"

Si el input es una descripción larga o una oración, extraé un label corto (2-4 palabras, capitalizado) que represente la categoría de forma concisa e incluilo en la respuesta válida.

Respondé SOLO con JSON válido, sin texto adicional. Tres posibles respuestas:
{"valid":true,"reason":"una oración corta en español","label":"Nombre corto si el input era largo, o null si ya era conciso"}
{"valid":false,"reason":"una oración corta en español","suggestion":"versión más amplia o null"}
{"unclear":true,"reason":"No entiendo la categoría propuesta. Intentá describirla con otras palabras."}`;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.groqModelChat,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 120,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq validate error ${response.status}: ${text}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content ?? '';
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Respuesta inválida del validador');
  return JSON.parse(match[0]);
}

export async function generateTopic({ date, recentTitles = [], interests = [] }) {
  const avoidLine = recentTitles.length > 0
    ? `\nTemas recientes a NO repetir: ${recentTitles.join(', ')}.`
    : '';

  const categoryLabels = interests.map(i => CATEGORIES[i]?.label ?? i);
  const interestsLine = interests.length > 0
    ? `\nEl tema DEBE pertenecer a alguna de estas categorías: ${interests.map(i => CATEGORIES[i]?.prompt ?? i).join(', ')}. No generes temas fuera de estas categorías.\nEl campo "primaryTag" DEBE ser exactamente uno de estos valores (sin modificar): ${categoryLabels.join(', ')}.`
    : '';

  const userPrompt = `Generá un tema educativo para el día ${date}.${avoidLine}${interestsLine}`;

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.groqModelTopic,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.85,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error ${response.status}: ${text}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;

  if (!content) throw new Error('Empty response from Groq');

  // Extract JSON — model may wrap it in markdown or add surrounding text
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No valid JSON in Groq response');

  let jsonStr = match[0];

  let topic;
  try {
    topic = JSON.parse(jsonStr);
  } catch {
    // LLMs sometimes put literal newlines inside JSON string values — sanitize and retry
    try {
      jsonStr = jsonStr.replace(/"(?:[^"\\]|\\.)*"/gs, m =>
        m.replace(/\n/g, '\\n').replace(/\r/g, '')
      );
      topic = JSON.parse(jsonStr);
    } catch {
      throw new Error('Failed to parse JSON from Groq response');
    }
  }

  // Validate required fields
  const required = ['title', 'topicKey', 'primaryTag', 'resume', 'keyPoints'];
  for (const field of required) {
    if (!topic[field]) throw new Error(`Missing field in AI response: ${field}`);
  }

  if (!Array.isArray(topic.keyPoints) || topic.keyPoints.length === 0) {
    throw new Error('keyPoints must be a non-empty array');
  }

  return topic;
}
