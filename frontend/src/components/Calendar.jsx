const DAY_HEADERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default function Calendar({ year, month, readDates, today, onDayClick }) {
  const readSet = new Set(readDates);

  // First weekday of the month (0=Sun..6=Sat) → convert to Mon-first (0=Mon..6=Sun)
  const firstDayRaw = new Date(year, month - 1, 1).getDay();
  const startOffset = (firstDayRaw + 6) % 7;

  const daysInMonth = new Date(year, month, 0).getDate();

  // Cells: null placeholders for offset, then day numbers 1..N
  const cells = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map(h => (
          <div key={h} className="text-center text-xs text-[#969B92] font-medium py-1">
            {h}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;

          const mm = String(month).padStart(2, '0');
          const dd = String(day).padStart(2, '0');
          const dateStr = `${year}-${mm}-${dd}`;

          const isToday  = dateStr === today;
          const isRead   = readSet.has(dateStr);
          const isFuture = dateStr > today;

          return (
            <button
              key={day}
              disabled={isFuture}
              onClick={() => onDayClick(dateStr)}
              className={[
                'relative mx-auto flex items-center justify-center w-9 h-9 rounded-full text-sm transition-colors',
                isRead
                  ? 'bg-[#BFA56A] text-white font-medium'
                  : isToday
                  ? 'ring-2 ring-[#BFA56A] ring-offset-1 ring-offset-white dark:ring-offset-[#252220] text-[#2F2F2F] dark:text-[#EDE9E1]'
                  : isFuture
                  ? 'text-[#C4BFB6] dark:text-[#5A5550] cursor-default'
                  : 'text-[#2F2F2F] dark:text-[#EDE9E1] hover:bg-[rgba(47,47,47,0.06)] dark:hover:bg-[rgba(255,255,255,0.06)] active:bg-[rgba(47,47,47,0.10)] dark:active:bg-[rgba(255,255,255,0.10)]',
              ].join(' ')}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
