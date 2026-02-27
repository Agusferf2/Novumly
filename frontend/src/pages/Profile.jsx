import { useState, useEffect } from 'react';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import BottomNav from '../components/BottomNav.jsx';
import logo from '../../assets/Logo.png';

const IC = '#8B6F47'; // warm brown for preference icons

function ScienceIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6M9 3v7l-4 9a1 1 0 0 0 .9 1.4h12.2A1 1 0 0 0 21 19l-4-9V3" />
      <path d="M9 12h6" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21h6M10 21v-1a5 5 0 1 1 4 0v1" />
      <path d="M9.5 14.5A5 5 0 0 1 9 12" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
         stroke={IC} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 5.3-1 10-4 12.5C13.5 16 12 17 11 20z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

const PREFERENCES = [
  { Icon: ScienceIcon, label: 'Ciencia' },
  { Icon: BulbIcon,    label: 'Innovación' },
  { Icon: LeafIcon,    label: 'Naturaleza' },
];

function getLast9Dates() {
  return Array.from({ length: 9 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (8 - i));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
}

function FlameIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="#BFA56A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="#BFA56A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Profile() {
  const { user } = useAuth();

  const now = new Date();
  const [streak,    setStreak]    = useState(null);
  const [readDates, setReadDates] = useState([]);

  useEffect(() => {
    apiFetch('/api/progress/streak')
      .then(data => setStreak(data.streak))
      .catch(() => setStreak(0));

    apiFetch(`/api/progress/month?year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      .then(data => setReadDates(data.readDates))
      .catch(() => setReadDates([]));
  }, []);

  const displayName = user?.email
    ? user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : '—';

  const last9 = getLast9Dates();
  const readSet = new Set(readDates);

  return (
    <div className="flex flex-col h-dvh bg-[#F4F1EA] max-w-[420px] mx-auto">

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-center px-5 py-2 bg-white border-b border-[rgba(47,47,47,0.08)]">
        <div className="flex items-center">
          <img src={logo} alt="" className="w-10 h-10 object-contain" />
          <span className="font-title text-[27px] font-semibold text-[#2F2F2F] leading-none self-end">Teachly.</span>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-4">

        {/* User card */}
        <div className="bg-white rounded-2xl px-5 py-5 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#969B92] flex items-center justify-center mb-1">
            <span className="text-white text-2xl font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <p className="font-title text-[20px] font-semibold text-[#2F2F2F] leading-tight">
            {displayName}
          </p>
          <p className="text-sm text-[#969B92]">{user?.email}</p>
        </div>

        {/* Racha card */}
        <div className="bg-white rounded-2xl px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-[#2F2F2F]">Racha</p>

          <div className="flex items-center gap-2">
            <FlameIcon />
            <span className="font-title text-[18px] font-semibold text-[#BFA56A]">
              {streak === null ? '—' : streak} {streak === 1 ? 'día seguido' : 'días seguidos'}
            </span>
          </div>

          {/* Last 9 days dots */}
          <div className="flex items-center gap-1.5">
            {last9.map(date => {
              const read = readSet.has(date);
              return (
                <div
                  key={date}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs
                    ${read
                      ? 'bg-[rgba(191,165,106,0.15)] border border-[#BFA56A]'
                      : 'bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)]'
                    }`}
                >
                  {read && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke="#BFA56A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#C4BFB6]">Racha máxima: — días</p>
        </div>

        {/* Preferencias card */}
        <div className="bg-white rounded-2xl px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#2F2F2F]">Preferencias</p>
            <button className="text-xs font-medium text-[#BFA56A]">Editar</button>
          </div>

          <div className="space-y-0">
            {PREFERENCES.map(({ Icon, label }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between py-3 ${
                  i < PREFERENCES.length - 1 ? 'border-b border-[rgba(47,47,47,0.06)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon />
                  <span className="text-sm text-[#2F2F2F]">{label}</span>
                </div>
                <CheckIcon />
              </div>
            ))}
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-white rounded-2xl px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-[#2F2F2F]">Apariencia</p>
          <div className="flex gap-3">
            {/* Light — active/selected */}
            <button className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border-2 border-[#BFA56A] bg-[rgba(191,165,106,0.06)] cursor-default">
              <div className="w-8 h-8 rounded-full bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="#BFA56A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#BFA56A]">Claro</span>
            </button>

            {/* Dark — inactive */}
            <button className="flex-1 flex flex-col items-center gap-2 py-3 rounded-xl border border-[rgba(47,47,47,0.10)] bg-transparent cursor-default">
              <div className="w-8 h-8 rounded-full bg-[#2F2F2F] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="#969B92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-[#969B92]">Oscuro</span>
            </button>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-[#2F2F2F]">Notificaciones</p>
          {/* Toggle — hardcoded off */}
          <div className="w-11 h-6 bg-[rgba(47,47,47,0.15)] rounded-full relative cursor-default">
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
          </div>
        </div>

        <div className="h-2" />
      </main>

      <BottomNav />
    </div>
  );
}
