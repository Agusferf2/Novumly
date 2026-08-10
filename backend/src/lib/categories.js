// Cada categoría tiene un label para mostrar y un prompt para guiar a Groq.
// "conceptos" tiene instrucción especial para que el modelo elija una palabra
// interesante y explique su origen, significado y trasfondo.
export const CATEGORIES = {
  historia:   { label: 'Historia',       prompt: 'Historia' },
  ciencia:    { label: 'Ciencia',        prompt: 'Ciencia' },
  tecnologia: { label: 'Tecnología',     prompt: 'Tecnología' },
  medicina:   { label: 'Medicina',       prompt: 'Medicina y Salud' },
  arte:       { label: 'Arte y Cultura', prompt: 'Arte y Cultura' },
  naturaleza: { label: 'Naturaleza',     prompt: 'Naturaleza' },
  conceptos:  {
    label: 'Conceptos',
    prompt: 'Conceptos (elegí una palabra o término interesante o desconocido — puede ser científico, filosófico, cotidiano o de jerga — y explicá su origen etimológico, su significado real y su trasfondo cultural o histórico)',
  },
};

export const VALID_INTERESTS = Object.keys(CATEGORIES);

export const computeFeedKey = (interests) =>
  !interests || interests.length === 0
    ? 'global'
    : [...interests].sort().join('+');
