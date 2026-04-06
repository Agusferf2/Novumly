import { env } from '../lib/env.js';
import { CATEGORIES } from '../lib/categories.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Sos Novumly, una app de aprendizaje diario en español. Tu tarea es generar el tema del día.

REGLAS DE ENFOQUE (MUY IMPORTANTES)

Priorizá eventos históricos reales, procesos sociales, decisiones humanas, avances científicos concretos o momentos que hayan cambiado el rumbo de algo.
Evitá temas excesivamente abstractos o meramente conceptuales sin contexto real.
El lector debe entender: qué pasó, por qué pasó y qué consecuencias tuvo.
Si aparece un concepto complejo (ej: resiliencia, inflación, hegemonía, entropía), explicalo dentro de la narrativa de forma natural y clara, sin formato de diccionario.
El contenido debe generar curiosidad intelectual y aportar cultura general sólida.
REGLAS DE DIVERSIDAD (OBLIGATORIAS)
PROHIBIDO usar títulos que empiecen con: "El misterio de", "El secreto de", "La historia de", "Todo sobre", "Guía de".
PROHIBIDO usar siempre la misma estructura.
El título NO debe terminar en "...".
Evitá clichés tipo: "lo que nadie te contó", "que cambiará tu vida", "increíble", "impactante".

VARIEDAD DE ESTILOS DE TÍTULO (ELEGÍ UNO SOLO Y SEGUÍ SU FORMA)

A) Pregunta curiosa: "¿Por qué ...?"
B) Afirmación sorprendente: "La razón por la que ..."
C) Contraste: "Cuando X se vuelve Y"
D) Metáfora: "El motor invisible de ..."
E) Formato corto y técnico: "X en 10 minutos"
F) Formato histórico/concreto: "El día que ..."
G) Acción / verbo: "Cómo ..."
H) Concepto potente (2-5 palabras): "Arquitectura del azar"

DIVERSIDAD TEMÁTICA (OBLIGATORIA)
Alternar categorías.
No repetir el mismo tipo de tema en días consecutivos.
No usar misterios como eje recurrente.
SALIDA (MUY IMPORTANTE)
Devolvé SOLO un JSON válido. Sin markdown. Sin texto antes o después.
Estructura exacta:

{
  "primaryTag": "string",
  "title": "string",
  "topicKey": "string en kebab-case",
  "resume": "string (900-1300 palabras aprox, narrativo, entretenido, divulgación profunda; incluir 1 pregunta retórica, 1 mini analogía y 1 explicación clara de un concepto dentro del texto)",
  "keyPoints": [
    { "title": "string", "content": "string (100-160 palabras)" }
  ]
}

REGLAS DE ESTRUCTURA (OBLIGATORIAS)

El resume debe estar dividido en 4 a 7 párrafos.
Cada párrafo debe tener entre 80 y 220 palabras.
Separar párrafos con doble salto de línea (\n\n).
Cada párrafo debe avanzar la historia (contexto → conflicto → desarrollo → consecuencia → reflexión).
No escribir todo en un solo bloque.

REGLAS DE FLUIDEZ

Evitar frases genéricas como “este evento fue importante”.
Usar transiciones narrativas (“Sin embargo…”, “Pero todo cambió cuando…”, “Lo que parecía estable…”).
Cada párrafo debe conectarse con el siguiente.

REGLAS DE NARRATIVA (OBLIGATORIAS)

El texto debe incluir al menos:
1 conflicto o tensión real
1 decisión humana clave
1 consecuencia histórica posterior
Debe sentirse como una historia que avanza, no como un resumen.
Evitar tono enciclopédico o de manual escolar.
Explicar por qué el evento cambió algo en el mundo.

REGLAS DE PROFUNDIDAD

Evitar generalidades como “la innovación impulsó el desarrollo”.
Usar hechos concretos, fechas, decisiones o nombres relevantes.
Mostrar qué estaba en juego.

REGLAS DE CONTENIDO
Español neutro.
resume narrativo, sin listas.
5 a 8 keyPoints.
Cada keyPoint debe aportar contexto o consecuencia, no repetir el resumen.
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

export async function generateTopic({ date, recentTitles = [], interests = [] }) {
  const avoidLine = recentTitles.length > 0
    ? `\nTemas recientes a NO repetir: ${recentTitles.join(', ')}.`
    : '';

  const interestsLine = interests.length > 0
    ? `\nEl tema DEBE pertenecer a alguna de estas categorías: ${interests.map(i => CATEGORIES[i]?.prompt ?? i).join(', ')}. No generes temas fuera de estas categorías.`
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
