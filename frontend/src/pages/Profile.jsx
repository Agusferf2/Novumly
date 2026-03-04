import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  FlameIcon, CheckIcon,
  ScienceIcon, BulbIcon, LeafIcon,
  SunIcon, MoonIcon, LogoutIcon,
} from '../components/Icons.jsx';
import BottomNav from '../components/BottomNav.jsx';
import logo from '../../assets/Logo.png';

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

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

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
    <div className="flex flex-col h-dvh bg-[#F4F1EA] dark:bg-[#1A1814] max-w-[420px] mx-auto">

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-center px-5 py-2 bg-white dark:bg-[#252220] border-b border-[rgba(47,47,47,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center">
          <img src={logo} alt="" className="w-10 h-10 object-contain" />
          <span className="font-title text-[27px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-none self-end">Novumly.</span>
        </div>
      </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-4">

        {/* User card */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-5 flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-[#969B92] flex items-center justify-center mb-1">
            <span className="text-white text-2xl font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <p className="font-title text-[20px] font-semibold text-[#2F2F2F] dark:text-[#EDE9E1] leading-tight">
            {displayName}
          </p>
          <p className="text-sm text-[#969B92]">{user?.email}</p>
        </div>

        {/* Racha card */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-[#2F2F2F] dark:text-[#EDE9E1]">Racha</p>

          <div className="flex items-center gap-2">
            <FlameIcon size={22} />
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
                      : 'bg-[#F4F1EA] dark:bg-[#1A1814] border border-[rgba(47,47,47,0.12)] dark:border-[rgba(255,255,255,0.12)]'
                    }`}
                >
                  {read && <CheckIcon size={12} />}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-[#C4BFB6] dark:text-[#5A5550]">Racha máxima: — días</p>
        </div>

        {/* Preferencias card */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[#2F2F2F] dark:text-[#EDE9E1]">Preferencias</p>
            <button className="text-xs font-medium text-[#BFA56A]">Editar</button>
          </div>

          <div className="space-y-0">
            {PREFERENCES.map(({ Icon, label }, i) => (
              <div
                key={label}
                className={`flex items-center justify-between py-3 ${
                  i < PREFERENCES.length - 1 ? 'border-b border-[rgba(47,47,47,0.06)] dark:border-[rgba(255,255,255,0.06)]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon />
                  <span className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">{label}</span>
                </div>
                <CheckIcon />
              </div>
            ))}
          </div>
        </div>

        {/* Apariencia */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 space-y-3">
          <p className="text-sm font-semibold text-[#2F2F2F] dark:text-[#EDE9E1]">Apariencia</p>
          <div className="flex gap-3">
            {/* Light */}
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${
                theme === 'light'
                  ? 'border-2 border-[#BFA56A] bg-[rgba(191,165,106,0.06)]'
                  : 'border border-[rgba(47,47,47,0.10)] dark:border-[rgba(255,255,255,0.10)] bg-transparent'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#F4F1EA] border border-[rgba(47,47,47,0.12)] flex items-center justify-center">
                <SunIcon color={theme === 'light' ? '#BFA56A' : '#969B92'} />
              </div>
              <span className={`text-xs font-medium ${theme === 'light' ? 'text-[#BFA56A]' : 'text-[#969B92]'}`}>Claro</span>
            </button>

            {/* Dark */}
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${
                theme === 'dark'
                  ? 'border-2 border-[#BFA56A] bg-[rgba(191,165,106,0.06)]'
                  : 'border border-[rgba(47,47,47,0.10)] dark:border-[rgba(255,255,255,0.10)] bg-transparent'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#2F2F2F] flex items-center justify-center">
                <MoonIcon color={theme === 'dark' ? '#BFA56A' : '#969B92'} />
              </div>
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-[#BFA56A]' : 'text-[#969B92]'}`}>Oscuro</span>
            </button>
          </div>
        </div>

        {/* Notificaciones */}
        <div className="bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 flex items-center justify-between">
          <p className="text-sm text-[#2F2F2F] dark:text-[#EDE9E1]">Notificaciones</p>
          {/* Toggle — hardcoded off */}
          <div className="w-11 h-6 bg-[rgba(47,47,47,0.15)] dark:bg-[rgba(255,255,255,0.15)] rounded-full relative cursor-default">
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white dark:bg-[#EDE9E1] rounded-full shadow-sm" />
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-white dark:bg-[#252220] rounded-2xl px-5 py-4 flex items-center gap-3 text-left active:opacity-70 transition-opacity"
        >
          <LogoutIcon />
          <span className="text-sm font-medium text-[#C05050]">Cerrar sesión</span>
        </button>

        <div className="h-2" />
      </main>

      <BottomNav />
    </div>
  );
}
