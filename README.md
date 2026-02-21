# Teachly — App de Aprendizaje Diario (PWA)

Aplicación web **mobile-first (PWA)** donde el usuario recibe un tema educativo nuevo cada día, en formato narrativo, con posibilidad de hacer preguntas y visualizar su progreso.

---

## Objetivo del MVP

- Autenticación (JWT)
- Tema del día
- Marcar como leído
- Calendario mensual
- Sistema de racha
- Chat limitado (5 preguntas por día)
- Generación automática del contenido con IA

---

## Stack Tecnológico

### Frontend

- React
- Vite
- React Router
- Tailwind
- PWA (manifest + service worker)

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT

### IA

- OpenRouter
- Modelo: `openai/gpt-oss-120b:free`
- Consumo exclusivo desde backend

---

## Arquitectura

Monorepo:

```bash
teachly/
  frontend/
  backend/
  README.md
```

Un solo feed para el MVP:

```js
feedKey = 'global';
```

---

## Modelo de Datos

### users

- email
- passwordHash
- feedKey (default: `"global"`)
- interests (opcional)

---

### daily_topics

- date (YYYY-MM-DD)
- feedKey
- topicKey
- primaryTag
- title
- resume
- keyPoints:
  - title
  - content

> Un tema por día por feed.

---

### user_day

- userId
- date

Registra si el usuario leyó ese día.  
Índice único: `(userId, date)`

---

### chat_messages

- userId
- date
- role (`"user"` | `"assistant"`)
- content

Máximo 5 preguntas por día.

---

## Flujo Principal

1. Usuario se registra o inicia sesión.
2. Consulta `GET /api/topic/today`.
3. Si el tema no existe, se genera automáticamente con IA y se guarda.
4. El usuario marca como leído.
5. Puede hacer hasta 5 preguntas.
6. Puede consultar calendario y racha.

---

## Variables de Entorno (backend)

```env
MONGO_URI=
JWT_SECRET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-oss-120b:free
PORT=4000
```

---

## Futuro

- Favoritos
- Notas personales
- Recomendaciones por intereses
- Notificaciones push
- Multi-feed
- Suscripción premium
