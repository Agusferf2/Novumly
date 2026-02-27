import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../lib/apiClient.js';

const MAX_QUESTIONS = 5;

function renderBold(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );
}

function renderContent(text) {
  const lines = text.split('\n');
  const nodes = [];
  let listBuffer = [];
  let k = 0;

  const flushList = () => {
    if (!listBuffer.length) return;
    nodes.push(
      <ul key={k++} className="list-disc pl-5 space-y-1 my-1">
        {listBuffer.map((item, i) => <li key={i}>{renderBold(item)}</li>)}
      </ul>
    );
    listBuffer = [];
  };

  for (const line of lines) {
    if (line.startsWith('* ')) {
      listBuffer.push(line.slice(2));
    } else {
      flushList();
      if (line.trim() === '') {
        nodes.push(<br key={k++} />);
      } else {
        nodes.push(<span key={k++} className="block">{renderBold(line)}</span>);
      }
    }
  }
  flushList();
  return nodes;
}
const CLOSE_THRESHOLD = 150;

export default function ChatDock({ topic }) {
  const [isOpen,        setIsOpen]        = useState(false);
  const [messages,      setMessages]      = useState([]);
  const [questionsLeft, setQuestionsLeft] = useState(MAX_QUESTIONS);
  const [input,         setInput]         = useState('');
  const [sending,       setSending]       = useState(false);
  const [error,         setError]         = useState('');

  // Sheet animation
  const [animIn,     setAnimIn]     = useState(false);
  const [dragY,      setDragY]      = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef    = useRef(0);
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    if (!topic?.date) return;
    apiFetch(`/api/chat/${topic.date}`)
      .then(data => { setMessages(data.messages); setQuestionsLeft(data.questionsLeft); })
      .catch(() => {});
  }, [topic?.date]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // Slide-up entrance animation when sheet opens
  useEffect(() => {
    if (isOpen) {
      setDragY(0);
      setIsDragging(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimIn(true);
          setTimeout(() => inputRef.current?.focus(), 320);
        });
      });
    } else {
      setAnimIn(false);
    }
  }, [isOpen]);

  function openSheet()  { setIsOpen(true); }

  function closeSheet() {
    setAnimIn(false);
    setTimeout(() => setIsOpen(false), 280);
  }

  // ── Drag-to-dismiss (handle area only) ──
  function onTouchStart(e) {
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  }
  function onTouchMove(e) {
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) setDragY(delta);
  }
  function onTouchEnd() {
    setIsDragging(false);
    if (dragY >= CLOSE_THRESHOLD) {
      closeSheet();
    } else {
      setDragY(0);
    }
  }

  // ── Send message ──
  async function handleSend() {
    const q = input.trim();
    if (!q || sending || questionsLeft === 0) return;

    setMessages(prev => [...prev, { role: 'user', content: q }]);
    setInput('');
    setSending(true);
    setError('');

    try {
      const data = await apiFetch(`/api/chat/${topic.date}`, {
        method: 'POST',
        body: JSON.stringify({ question: q }),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      setQuestionsLeft(data.questionsLeft);
    } catch (err) {
      setError(err.message || 'Error al enviar.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  const isDisabled = sending || questionsLeft === 0;

  const sheetStyle = {
    transform:  animIn ? `translateY(${dragY}px)` : 'translateY(100%)',
    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  };

  return (
    <>
      {/* ── Trigger bar (collapsed) ── */}
      <div
        role="button"
        onClick={openSheet}
        className="flex-shrink-0 bg-white dark:bg-[#252220] border-t border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)] px-5 py-4 flex items-center justify-between cursor-pointer active:bg-[rgba(47,47,47,0.03)] dark:active:bg-[rgba(255,255,255,0.03)]"
      >
        <span className="text-sm text-[#969B92]">
          {questionsLeft === 0 ? 'Ver conversación de hoy' : 'Preguntá sobre el tema...'}
        </span>
        <span className="text-xs font-medium text-[#BFA56A]">
          {questionsLeft} {questionsLeft === 1 ? 'restante' : 'restantes'} ↑
        </span>
      </div>

      {/* ── Full-screen chat sheet ── */}
      {isOpen && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-dvh z-50 bg-white dark:bg-[#252220] flex flex-col"
          style={sheetStyle}
        >
          {/* Drag handle — touch events only here */}
          <div
            className="touch-none flex-shrink-0 pt-3 pb-1 cursor-grab active:cursor-grabbing"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="w-10 h-1 bg-[rgba(47,47,47,0.15)] dark:bg-[rgba(255,255,255,0.15)] rounded-full mx-auto" />
          </div>

          {/* Topic title + meta */}
          <div className="flex-shrink-0 px-5 pt-2 pb-2 border-b border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)] text-center">
            <h2 className="font-title text-[21px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-snug">
              {topic.title}
            </h2>
            <p className="text-xs text-[#969B92] mt-1">
              {questionsLeft === 0
                ? 'Límite diario alcanzado'
                : `${questionsLeft} ${questionsLeft === 1 ? 'pregunta' : 'preguntas'} restante${questionsLeft === 1 ? '' : 's'} hoy`}
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 && !sending && (
              <div className="flex items-center justify-center h-full">
                <p className="text-[#C4BFB6] dark:text-[#5A5550] text-sm text-center px-8">
                  Hacé tu primera pregunta sobre el tema de hoy.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#969B92] text-white rounded-br-sm'
                    : 'bg-[#F4F1EA] dark:bg-[#1A1814] text-[#2F2F2F] dark:text-[#EDE9E1] rounded-bl-sm'
                }`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-[#F4F1EA] dark:bg-[#1A1814] px-3 py-2.5 rounded-2xl rounded-bl-sm text-sm text-[#969B92]">
                  Escribiendo...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)] px-4 pt-3 pb-3">
            {error && <p className="text-xs text-[#7A3535] mb-2">{error}</p>}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isDisabled}
                placeholder={questionsLeft === 0 ? 'Sin preguntas disponibles' : 'Escribí tu pregunta...'}
                className="flex-1 h-11 px-3 bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)] rounded-xl text-sm text-[#2F2F2F] dark:text-[#EDE9E1] placeholder-[#C4BFB6] disabled:opacity-50 focus:outline-none focus:border-[#BFA56A] transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isDisabled || !input.trim()}
                className="h-11 px-4 bg-[#969B92] text-white text-sm font-medium rounded-xl disabled:opacity-30 transition-opacity"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
