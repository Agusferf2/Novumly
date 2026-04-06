import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import Loader from './Loader.jsx';

const CLOSE_THRESHOLD = 80; // px dragged down to trigger close

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d));
}

export default function DayBottomSheet({ date, onClose }) {
  const navigate = useNavigate();

  const [topic,      setTopic]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

  // Animation state
  const [animIn,     setAnimIn]     = useState(false);

  // Drag state
  const [dragY,      setDragY]      = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  // Fetch topic when date changes
  useEffect(() => {
    if (!date) {
      setAnimIn(false);
      setTopic(null);
      setError('');
      return;
    }

    // Reset drag and trigger entrance animation
    setDragY(0);
    setIsDragging(false);
    setLoading(true);
    setTopic(null);
    setError('');

    // Double rAF ensures the initial translateY(100%) renders before transition kicks in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimIn(true));
    });

    apiFetch(`/api/topic/${date}`)
      .then(data => setTopic(data))
      .catch(err  => setError(err.message))
      .finally(() => setLoading(false));
  }, [date]);

  // --- Drag handlers (only on the handle area) ---
  function onTouchStart(e) {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }

  function onTouchMove(e) {
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) setDragY(delta); // Only downward
  }

  function onTouchEnd() {
    setIsDragging(false);
    if (dragY >= CLOSE_THRESHOLD) {
      setAnimIn(false);
      // Wait for exit animation before calling onClose
      setTimeout(onClose, 280);
    } else {
      setDragY(0); // Snap back
    }
  }

  if (!date) return null;

  const googleUrl = topic
    ? `https://www.google.com/search?q=${encodeURIComponent(`${topic.title} ${topic.primaryTag}`)}`
    : null;

  const sheetStyle = {
    transform: animIn ? `translateY(${dragY}px)` : 'translateY(100%)',
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 bg-white dark:bg-[#252220] rounded-t-3xl shadow-xl"
        style={sheetStyle}
      >
        {/* ── Drag handle area ── touch events only here ── */}
        <div
          className="touch-none pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Pill indicator */}
          <div className="w-10 h-1 bg-[rgba(47,47,47,0.15)] dark:bg-[rgba(255,255,255,0.15)] rounded-full mx-auto" />
        </div>

        {/* ── Sheet content ── */}
        <div className="px-5 pb-8">

          {/* Date row + close button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#969B92] capitalize">
              {formatDate(date)}
            </p>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#969B92] hover:bg-[rgba(47,47,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.06)] text-lg leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="py-8 flex items-center justify-center">
              <Loader size="sm" />
            </div>
          )}

          {/* No topic */}
          {!loading && (error || !topic) && (
            <div className="py-6 text-center">
              <p className="text-[#969B92] text-sm">Aún no hay tema para este día.</p>
            </div>
          )}

          {/* Topic content */}
          {!loading && topic && (
            <div className="space-y-3">

              {/* Tag + read status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-[#969B92] bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.10)] dark:border-[rgba(255,255,255,0.10)] px-3 py-1 rounded-full uppercase tracking-[0.05em]">
                  {topic.primaryTag}
                </span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  topic.isRead
                    ? 'bg-[rgba(191,165,106,0.15)] text-[#BFA56A]'
                    : 'bg-[rgba(150,155,146,0.10)] text-[#969B92]'
                }`}>
                  {topic.isRead ? '● Leído' : '○ Sin leer'}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-title text-[22px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-snug text-center">
                {topic.title}
              </h2>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => { onClose(); navigate(`/topic/${date}`); }}
                  className="w-full h-12 bg-[#2F2F2F] dark:bg-[#EDE9E1] text-white dark:text-[#2F2F2F] font-medium rounded-2xl text-[15px]"
                >
                  Ver tema completo
                </button>
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 flex items-center justify-center border border-[rgba(47,47,47,0.15)] dark:border-[rgba(255,255,255,0.15)] text-[#2F2F2F] dark:text-[#EDE9E1] font-medium rounded-2xl text-[15px] hover:bg-[rgba(47,47,47,0.04)] dark:hover:bg-[rgba(255,255,255,0.04)]"
                >
                  Buscar en Google
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}
