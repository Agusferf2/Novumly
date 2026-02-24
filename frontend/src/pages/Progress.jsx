import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../lib/apiClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import Calendar from '../components/Calendar.jsx';
import DayBottomSheet from '../components/DayBottomSheet.jsx';
import logo from '../../assets/Logo.png';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

function getTodayLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateShort(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(y, m - 1, d));
}

export default function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const today = getTodayLocal();

  const [year,          setYear]          = useState(now.getFullYear());
  const [month,         setMonth]         = useState(now.getMonth() + 1);
  const [streak,        setStreak]        = useState(null);
  const [readDates,     setReadDates]     = useState([]);
  const [recentTopics,  setRecentTopics]  = useState([]);
  const [loadingStreak, setLoadingStreak] = useState(true);
  const [loadingMonth,  setLoadingMonth]  = useState(true);
  const [selectedDate,  setSelectedDate]  = useState(null);

  useEffect(() => {
    apiFetch('/api/progress/streak')
      .then(data => setStreak(data.streak))
      .catch(() => setStreak(0))
      .finally(() => setLoadingStreak(false));

    apiFetch('/api/progress/recent?limit=5')
      .then(data => setRecentTopics(data.topics))
      .catch(() => setRecentTopics([]));
  }, []);

  useEffect(() => {
    setLoadingMonth(true);
    apiFetch(`/api/progress/month?year=${year}&month=${month}`)
      .then(data => setReadDates(data.readDates))
      .catch(() => setReadDates([]))
      .finally(() => setLoadingMonth(false));
  }, [year, month]);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;
    if (isCurrentMonth) return;
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1;

  return (
    <>
      <div className="flex flex-col h-dvh bg-[#F4F1EA] max-w-[420px] mx-auto">

        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-5 py-2 bg-white border-b border-[rgba(47,47,47,0.08)]">
          <div className="flex items-center">
            <img src={logo} alt="" className="w-10 h-10 object-contain" />
            <span className="font-title text-[27px] font-semibold text-[#2F2F2F] leading-none self-end">Teachly.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#6B7280]">Progreso</span>
            <div className="w-8 h-8 rounded-full bg-[#969B92] flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {user?.email?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          {/* Streak banner — compact */}
          <div className="bg-white rounded-2xl px-5 py-3 flex items-center gap-3 border border-[rgba(47,47,47,0.06)]">
            <span className="text-xl">🔥</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-title text-2xl font-semibold text-[#BFA56A] leading-none">
                {loadingStreak ? '—' : streak}
              </span>
              <span className="text-sm text-[#969B92]">
                {streak === 1 ? 'día seguido' : 'días seguidos'}
              </span>
            </div>
          </div>

          {/* Calendar card */}
          <div className="bg-white rounded-2xl p-5">

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(47,47,47,0.06)] text-[#2F2F2F] text-sm"
              >
                ◀
              </button>
              <span className="text-sm font-medium text-[#2F2F2F]">
                {MONTH_NAMES[month - 1]} {year}
              </span>
              <button
                onClick={nextMonth}
                disabled={isCurrentMonth}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[rgba(47,47,47,0.06)] text-[#2F2F2F] disabled:text-[#C4BFB6] disabled:cursor-default text-sm"
              >
                ▶
              </button>
            </div>

            {loadingMonth ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-[#969B92] text-sm">Cargando...</p>
              </div>
            ) : (
              <Calendar
                year={year}
                month={month}
                readDates={readDates}
                today={today}
                onDayClick={date => setSelectedDate(date)}
              />
            )}

            <p className="text-xs text-[#C4BFB6] text-center mt-4">
              Toca un día para ver el tema
            </p>
          </div>

          {/* Recent topics */}
          {recentTopics.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#969B92] uppercase tracking-[0.06em] mb-3 px-1 text-center">
                Últimos leídos
              </p>
              <div className="space-y-2">
                {recentTopics.map(t => (
                  <button
                    key={t.date}
                    onClick={() => navigate(`/topic/${t.date}`)}
                    className="w-full bg-white rounded-2xl px-4 py-3 flex items-start gap-3 text-left hover:bg-[rgba(255,255,255,0.7)] active:scale-[0.98] transition-transform"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-medium text-[#969B92] uppercase tracking-[0.05em]">
                          {t.primaryTag}
                        </span>
                        <span className="text-[10px] text-[#C4BFB6]">
                          {formatDateShort(t.date)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-[#2F2F2F] leading-snug line-clamp-2">
                        {t.title}
                      </p>
                    </div>
                    <span className="text-[#C4BFB6] text-sm mt-0.5 flex-shrink-0">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="h-2" />
        </main>
      </div>

      {/* Bottom sheet — outside scroll container so it overlays correctly */}
      <DayBottomSheet
        date={selectedDate}
        onClose={() => setSelectedDate(null)}
      />
    </>
  );
}
