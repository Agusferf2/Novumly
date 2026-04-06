import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient.js';
import KeyPoints from '../components/KeyPoints.jsx';
import ChatDock from '../components/ChatDock.jsx';
import BottomNav from '../components/BottomNav.jsx';
import Loader from '../components/Loader.jsx';
import logo from '../../assets/Logo.png';

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export default function Today() {
  const [topic,   setTopic]   = useState(null);
  const [isRead,  setIsRead]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [noTopic, setNoTopic] = useState(false);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    apiFetch('/api/topic/today')
      .then(data => { setTopic(data); setIsRead(data.isRead); setError(''); })
      .catch(err  => {
        if (err.code === 'NOT_FOUND') setNoTopic(true);
        else setError(err.message);
      })
      .finally(()  => setLoading(false));
  }, []);

  async function handleMarkRead() {
    setMarking(true);
    try {
      await apiFetch(`/api/topic/${topic.date}/read`, { method: 'POST' });
      setIsRead(true);
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-[#F4F1EA] dark:bg-[#1A1814] max-w-[420px] mx-auto">

      {/* Header fijo */}
      <header className="flex-shrink-0 flex items-center justify-center px-5 py-2 bg-white dark:bg-[#252220] border-b border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center">
          <img src={logo} alt="" className="w-10 h-10 object-contain" />
          <span className="font-title text-[27px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-none self-end">Novumly.</span>
        </div>
      </header>

      {/* Contenido scrollable */}
      <main className="flex-1 overflow-y-auto px-5 py-6">

        {loading && (
          <div className="flex items-center justify-center h-48">
            <Loader label="Un momento..." />
          </div>
        )}

        {noTopic && (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-center">
            <p className="text-[#2F2F2F] dark:text-[#EDE9E1] text-sm font-medium">El tema de hoy aún no está disponible.</p>
            <p className="text-[#969B92] text-xs">Volvé más tarde.</p>
          </div>
        )}

        {error && (
          <div className="bg-[rgba(155,64,64,0.07)] text-[#7A3535] text-sm px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        {topic && (
          <div className="space-y-5">

            {/* Tag */}
            <span className="inline-block text-xs font-medium text-[#969B92] bg-white dark:bg-[#252220] border border-[rgba(47,47,47,0.10)] dark:border-[rgba(255,255,255,0.10)] px-3 py-1 rounded-full uppercase tracking-[0.05em]">
              {topic.primaryTag}
            </span>

            {/* Título */}
            <h1 className="font-title text-[32px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-tight tracking-[-0.01em]">
              {topic.title}
            </h1>

            {/* Fecha */}
            <p className="text-sm text-[#969B92] flex items-center gap-1.5">
              <span>🕐</span>
              {formatDate(topic.date)}
            </p>

            {/* Resume */}
            <div className="text-[#2F2F2F] dark:text-[#EDE9E1] text-[16px] leading-[1.75] space-y-4">
              {topic.resume.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Key Points acordeón */}
            <KeyPoints keyPoints={topic.keyPoints} />

            {/* Botón marcar leído */}
            <button
              onClick={handleMarkRead}
              disabled={isRead || marking}
              className="w-full h-12 bg-[#969B92] text-white font-medium rounded-2xl text-[15px] disabled:opacity-60 transition-opacity duration-150 mt-2"
            >
              {isRead ? '✓ Leído' : marking ? 'Guardando...' : 'Marcar como leído'}
            </button>

            <div className="h-2" />
          </div>
        )}
      </main>

      {topic && <ChatDock topic={topic} />}
      <BottomNav />

    </div>
  );
}
